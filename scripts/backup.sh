#!/bin/bash
# NexaWorlds - Backup journalier DB
# Ajouter au crontab: 0 4 * * * /opt/nexaworlds/scripts/backup.sh

BACKUP_DIR="/opt/nexaworlds/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
DB_CONTAINER="nexaworlds-db"
DB_NAME="nexaworlds"
DB_USER="nexaworlds"
DB_PASS="${DB_PASSWORD:-nexaworlds_password}"
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup..."

# Dump database
docker exec "$DB_CONTAINER" mysqldump -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

if [ $? -eq 0 ]; then
    echo "[$(date)] Database backup completed: db_$DATE.sql.gz"
    SIZE=$(du -h "$BACKUP_DIR/db_$DATE.sql.gz" | cut -f1)
    echo "[$(date)] Backup size: $SIZE"
else
    echo "[$(date)] ERROR: Database backup failed!"
    exit 1
fi

# Clean old backups
find "$BACKUP_DIR" -name "db_*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "[$(date)] Old backups cleaned (retention: ${RETENTION_DAYS} days)"

echo "[$(date)] Backup completed successfully."
