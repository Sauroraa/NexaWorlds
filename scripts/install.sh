#!/bin/bash

# ==========================================
# NexaWorlds VPS Installation Script
# ==========================================

set -e

echo "🚀 NexaWorlds VPS Installation"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ==========================================
# 1. System Update & Dependencies
# ==========================================
echo -e "${YELLOW}[1/6] Updating system...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}[2/6] Installing dependencies...${NC}"
apt install -y curl git nginx certbot python3-certbot-nginx docker.io docker-compose

# ==========================================
# 2. Node.js Installation
# ==========================================
echo -e "${YELLOW}[3/6] Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# ==========================================
# 3. Directory Setup
# ==========================================
echo -e "${YELLOW}[4/6] Creating directories...${NC}"

# Site
mkdir -p /var/www/nexaworlds.fr
chown -R www-data:www-data /var/www/nexaworlds.fr

# Bot
mkdir -p /home/NexaBot
chown -R root:root /home/NexaBot

# ==========================================
# 4. Clone Repository
# ==========================================
echo -e "${YELLOW}[5/6] Cloning repository...${NC}"
cd /var/www
rm -rf nexaworlds.fr
git clone https://github.com/Sauronaa/NexaWorlds.git nexaworlds.fr

# Copy bot to home
cp -r /var/www/nexaworlds.fr/nexabot /home/NexaBot

# ==========================================
# 5. Environment Setup
# ==========================================
echo -e "${YELLOW}[6/6] Setting up environment...${NC}"

# Backend .env
cp /var/www/nexaworlds.fr/backend/.env.example /var/www/nexaworlds.fr/backend/.env 2>/dev/null || true

# Bot .env
cp /var/www/nexaworlds.fr/nexabot/.env.example /var/www/nexaworlds.fr/nexabot/.env 2>/dev/null || true
cp /home/NexaBot/.env.example /home/NexaBot/.env 2>/dev/null || true

# ==========================================
# 6. Docker Setup
# ==========================================
echo -e "${YELLOW}Setting up Docker...${NC}"
systemctl enable docker
systemctl start docker

# Build and start containers
cd /var/www/nexaworlds.fr/docker
docker-compose up -d --build

# ==========================================
# 7. Nginx Setup
# ==========================================
echo -e "${YELLOW}Setting up Nginx...${NC}"

# Create nginx config
cat > /etc/nginx/sites-available/nexaworlds.fr << 'EOF'
server {
    server_name nexaworlds.fr www.nexaworlds.fr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/nexaworlds.fr /etc/nginx/sites-enabled/
nginx -t

# ==========================================
# 8. NexaBot Service
# ==========================================
echo -e "${YELLOW}Setting up NexaBot service...${NC}"

# Copy service file
cp /var/www/nexaworlds.fr/scripts/nexabot.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable nexabot

# ==========================================
# Final
# ==========================================
echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit /var/www/nexaworlds.fr/backend/.env with your database credentials"
echo "2. Edit /home/NexaBot/.env with your Discord bot token"
echo "3. Run: systemctl start nexabot"
echo "4. Run: certbot --nginx -d nexaworlds.fr"
echo ""
echo "To deploy updates:"
echo "cd /var/www/nexaworlds.fr && ./scripts/deploy.sh"
