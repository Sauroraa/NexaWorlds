#!/bin/bash

# ==========================================
# NEXAWORLDS DEPLOY COMPLET - ONE COMMAND
# ==========================================
# Usage: curl -s https://raw.githubusercontent.com/Sauronaa/NexaWorlds/main/deploy-vps.sh | bash

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     NEXAWORLDS DEPLOY - PRODUCTION        ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
echo ""

# ==========================================
# Vérifications initiales
# ==========================================
echo -e "${YELLOW}[1/8] Vérifications...${NC}"

if [ "$EUID" -ne 0 ]; then
   echo -e "${RED}Erreur: Veuillez exécuter en tant que root${NC}"
   exit 1
fi

# ==========================================
# Mise à jour système
# ==========================================
echo -e "${YELLOW}[2/8] Mise à jour du système...${NC}"
export DEBIAN_FRONTEND=noninteractive
apt update -qq && apt upgrade -y -qq

# ==========================================
# Installation dépendances
# ==========================================
echo -e "${YELLOW}[3/8] Installation des dépendances...${NC}"

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
apt install -y -qq nodejs git curl nginx docker.io docker-compose certbot python3-certbot-nginx > /dev/null 2>&1

# Docker enable
systemctl enable docker > /dev/null 2>&1
systemctl start docker > /dev/null 2>&1

# ==========================================
# Création répertoires
# ==========================================
echo -e "${YELLOW}[4/8] Création des répertoires...${NC}"

mkdir -p /var/www/nexaworlds.fr
mkdir -p /home/NexaBot
mkdir -p /opt/nexaworlds/servers

# ==========================================
# Clone / Update Git
# ==========================================
echo -e "${YELLOW}[5/8] Téléchargement du projet...${NC}"

cd /var/www
rm -rf nexaworlds.fr
git clone --depth 1 https://github.com/Sauroraa/NexaWorlds.git nexaworlds.fr

# Copie bot
cp -r /var/www/nexaworlds.fr/nexabot /home/NexaBot
cp -r /var/www/nexaworlds.fr/docker /var/www/nexaworlds.fr/docker

# ==========================================
# Configuration .env
# ==========================================
echo -e "${YELLOW}[6/8] Configuration...${NC}"

# Backend .env
if [ ! -f "/var/www/nexaworlds.fr/backend/.env" ]; then
    cp /var/www/nexaworlds.fr/backend/.env.example /var/www/nexaworlds.fr/backend/.env 2>/dev/null || true
fi

# Bot .env
if [ ! -f "/home/NexaBot/.env" ]; then
    cp /var/www/nexaworlds.fr/nexabot/.env.example /home/NexaBot/.env 2>/dev/null || true
fi

# Create env if not exist
cat > /var/www/nexaworlds.fr/backend/.env << 'ENDBACKEND'
DATABASE_URL="mysql://nexaworlds:nexaworlds_password@mariadb:3306/nexaworlds"
REDIS_URL=redis://redis:6379
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
NEXABOT_API_KEY=nxl_$(openssl rand -hex 16)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
ENDBACKEND

# Bot .env
cat > /home/NexaBot/.env << 'ENDBOT'
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=
API_URL=http://localhost:3001/api
API_KEY=nxl_$(openssl rand -hex 16)
REDIS_URL=redis://localhost:6379
ENDBOT

# ==========================================
# Docker Build
# ==========================================
echo -e "${YELLOW}[7/8] Construction Docker...${NC}"

cd /var/www/nexaworlds.fr/docker

# Start mariadb & redis first
docker-compose up -d mariadb redis

# Wait for database
echo "Attente base de données..."
sleep 10

# Generate Prisma
docker-compose exec -T backend npx prisma generate
docker-compose exec -T backend npx prisma migrate deploy

# Start all services
docker-compose up -d --build

# ==========================================
# Nginx
# ==========================================
echo -e "${YELLOW}[8/8] Configuration Nginx...${NC}"

cat > /etc/nginx/sites-available/nexaworlds.fr << 'EOF'
server {
    server_name nexaworlds.fr www.nexaworlds.fr;
    root /var/www/nexaworlds.fr/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
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

ln -sf /etc/nginx/sites-available/nexaworlds.fr /etc/nginx/sites-enabled/
nginx -t

# ==========================================
# NexaBot Service
# ==========================================
cat > /etc/systemd/system/nexabot.service << 'EOF'
[Unit]
Description=NexaBot Discord
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/NexaBot
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable nexabot > /dev/null 2>&1

# ==========================================
# Final
# ==========================================
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        ✅ DEPLOIEMENT TERMINE!           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Prochaines étapes:${NC}"
echo ""
echo -e "${BLUE}1. Discord Bot:${NC}"
echo "   - Allez sur https://discord.com/developers/applications"
echo "   - Créez un bot et récupérez le TOKEN"
echo "   - Edit: nano /home/NexaBot/.env"
echo "   - Remplacez DISCORD_TOKEN= avec votre token"
echo ""
echo -e "${BLUE}2. SSL (HTTPS):${NC}"
echo "   - Assurez-vous que nexaworlds.fr pointe vers ce serveur"
echo "   - Lancez: certbot --nginx -d nexaworlds.fr"
echo ""
echo -e "${BLUE}3. Démarrer le bot:${NC}"
echo "   - systemctl start nexabot"
echo "   - systemctl status nexabot"
echo ""
echo -e "${BLUE}4. Commandes utiles:${NC}"
echo "   - Docker: docker-compose -f /var/www/nexaworlds.fr/docker/docker-compose.yml logs -f"
echo "   - Bot: journalctl -u nexabot -f"
echo "   - Redis: docker exec -it nexaworlds-redis redis-cli"
echo ""
echo -e "${GREEN}Services:${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
