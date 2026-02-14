#!/bin/bash

# ==========================================
# NexaWorlds Deployment Script - Production
# ==========================================

set -e

echo "🚀 Starting NexaWorlds Deployment..."

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
SITE_DIR="/var/www/nexaworlds.fr"
BOT_DIR="/home/NexaBot"
BACKEND_DIR="/home/NexaBot/backend"

# ==========================================
# 1. Deploy Site (Frontend + Backend)
# ==========================================
echo -e "${YELLOW}[1/4] Deploying Site to $SITE_DIR...${NC}"

# Create directories if not exist
mkdir -p $SITE_DIR

# Pull or copy files
if [ -d ".git" ]; then
    echo "Using git files..."
else
    echo "Files already in place"
fi

# Build frontend
echo "Building frontend..."
cd $SITE_DIR/frontend
npm install --production
npm run build

# Build backend  
echo "Building backend..."
cd $SITE_DIR/backend
npm install
npm run build

# ==========================================
# 2. Deploy NexaBot
# ==========================================
echo -e "${YELLOW}[2/4] Deploying NexaBot to $BOT_DIR...${NC}"

mkdir -p $BOT_DIR

# Install bot dependencies
cd $BOT_DIR
npm install
npm run build

# ==========================================
# 3. Database Migration
# ==========================================
echo -e "${YELLOW}[3/4] Running database migrations...${NC}"

cd $SITE_DIR/backend
npx prisma generate
npx prisma migrate deploy

# ==========================================
# 4. Services Restart
# ==========================================
echo -e "${YELLOW}[4/4] Restarting services...${NC}"

# Stop and start Docker containers
cd $SITE_DIR/docker
docker-compose down
docker-compose up -d --build

# Restart NexaBot if running as service
if [ -f "/etc/systemd/system/nexabot.service" ]; then
    sudo systemctl restart nexabot
fi

# ==========================================
# Final Status
# ==========================================
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Services status:"
docker-compose -f $SITE_DIR/docker/docker-compose.yml ps
echo ""
echo "NexaBot status:"
sudo systemctl status nexabot 2>/dev/null || echo "NexaBot service not configured"
