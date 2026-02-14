#!/bin/bash

set -e

echo "========================================"
echo "  NexaWorlds Deployment Script"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# Variables
PROJECT_DIR="/var/www/nexaworlds.fr"
BOT_DIR="/home/NexaBot"
GIT_REPO="https://github.com/Sauroraa/NexaWorlds.git"

# Update system
echo -e "${YELLOW}Updating system...${NC}"
apt update && apt upgrade -y

# Install required packages
echo -e "${YELLOW}Installing required packages...${NC}"
apt install -y git curl docker.io docker-compose

# Start Docker
systemctl start docker
systemctl enable docker

# Clone repository
echo -e "${YELLOW}Cloning repository...${NC}"
rm -rf $PROJECT_DIR
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR
git clone --depth 1 $GIT_REPO .

# Create backend .env if not exists
echo -e "${YELLOW}Creating backend .env...${NC}"
cat > $PROJECT_DIR/backend/.env << 'ENDBACKEND'
# Database
DATABASE_URL="mysql://nexaworlds:nexaworlds_password@mariadb:3306/nexaworlds"

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=nexaworlds_jwt_secret_change_this
JWT_EXPIRES_IN=7d

# Server
PORT=3020
NODE_ENV=production

# Discord
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=https://nexaworlds.fr/api/auth/callback/discord

# Stripe (Boutique)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Mail (Optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# API Keys
NEXABOT_API_KEY=nxl_nexaworlds_api_key
ENDBACKEND

# Create bot .env if not exists
echo -e "${YELLOW}Creating bot .env...${NC}"
mkdir -p $BOT_DIR
cat > $BOT_DIR/.env << 'ENDBOT'
# Discord
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=

# API
API_URL=http://backend:3020/api
API_KEY=nxl_nexaworlds_api_key

# Redis
REDIS_URL=redis://redis:6379
ENDBOT

# Copy bot files
echo -e "${YELLOW}Copying bot files...${NC}"
cp -r $PROJECT_DIR/nexabot/* $BOT_DIR/

# Build and start Docker containers
echo -e "${YELLOW}Building and starting Docker containers...${NC}"
cd $PROJECT_DIR/docker
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services
echo -e "${YELLOW}Waiting for services...${NC}"
sleep 15

# Check status
echo -e "${YELLOW}Checking services status...${NC}"
docker-compose ps

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Edit backend .env: nano $PROJECT_DIR/backend/.env"
echo "2. Edit bot .env: nano $BOT_DIR/.env"
echo "3. Restart containers: cd $PROJECT_DIR/docker && docker-compose restart"
echo ""
echo -e "${YELLOW}Logs:${NC}"
echo "Backend: docker-compose logs -f backend"
echo "Bot: docker-compose logs -f nexabot"
echo "Frontend: docker-compose logs -f frontend"
