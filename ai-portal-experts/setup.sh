#!/bin/bash

# AI Portal Specialists Management System Setup Script
# This script initializes the complete specialists management system

set -e

echo "🚀 Starting AI Portal Specialists Management System Setup..."

# Configuration
WORKSPACE_DIR="/workspace/ai-portal-experts"
PROJECTS_DIR="/root/projects"
DOCKER_DIR="${PROJECTS_DIR}/docker/specialists"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root"
   exit 1
fi

# Step 1: Create directory structure
print_status "Creating directory structure..."

# Create main directories if they don't exist
mkdir -p ${DOCKER_DIR}/{api,worker,nginx}
mkdir -p ${PROJECTS_DIR}/logs/specialists
mkdir -p ${PROJECTS_DIR}/data/specialists

# Copy workspace files to production location
if [ -d "$WORKSPACE_DIR" ]; then
    cp -r ${WORKSPACE_DIR}/* ${DOCKER_DIR}/
    print_success "Copied workspace files to production directory"
else
    print_warning "Workspace directory not found, creating empty structure"
fi

# Step 2: Create Docker files
print_status "Creating Docker configuration files..."

# API Dockerfile
cat > ${DOCKER_DIR}/api/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# API requirements.txt
cat > ${DOCKER_DIR}/api/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
asyncpg==0.29.0
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
redis==5.0.1
httpx==0.25.2
prometheus-client==0.19.0
EOF

# Worker Dockerfile
cat > ${DOCKER_DIR}/worker/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run the worker
CMD ["python", "worker.py"]
EOF

# Worker requirements.txt
cat > ${DOCKER_DIR}/worker/requirements.txt << 'EOF'
celery==5.3.4
redis==5.0.1
asyncpg==0.29.0
python-telegram-bot==20.7
httpx==0.25.2
EOF

# Step 3: Create docker-compose.yml
print_status "Creating docker-compose configuration..."

cat > ${DOCKER_DIR}/docker-compose.yml << 'EOF'
version: '3.8'

services:
  specialists-api:
    build: ./api
    container_name: specialists-api
    restart: unless-stopped
    ports:
      - "8001:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/aiportal
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY=${SECRET_KEY:-your-secret-key-here}
      - AUTHENTIK_URL=http://authentik-server:9000
    volumes:
      - ./rules:/app/rules:ro
      - ./departments:/app/departments
      - ./reports:/app/reports
      - ${PROJECTS_DIR}/logs/specialists:/app/logs
    networks:
      - traefik-network
      - internal
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.specialists.rule=Host(`specialists.${DOMAIN:-localhost}`)"
      - "traefik.http.services.specialists.loadbalancer.server.port=8000"
      - "traefik.http.routers.specialists.entrypoints=websecure"
      - "traefik.http.routers.specialists.tls.certresolver=letsencrypt"
    depends_on:
      - postgres
      - redis

  specialists-worker:
    build: ./worker
    container_name: specialists-worker
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/aiportal
      - REDIS_URL=redis://redis:6379
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - N8N_URL=http://n8n:5678
    volumes:
      - ./workflows:/app/workflows
      - ${PROJECTS_DIR}/logs/specialists:/app/logs
    networks:
      - internal
    depends_on:
      - postgres
      - redis

  specialists-nginx:
    image: nginx:alpine
    container_name: specialists-nginx
    restart: unless-stopped
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./reports:/usr/share/nginx/html/reports:ro
    networks:
      - traefik-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.specialists-reports.rule=Host(`reports.specialists.${DOMAIN:-localhost}`)"
      - "traefik.http.services.specialists-reports.loadbalancer.server.port=80"

networks:
  traefik-network:
    external: true
  internal:
    external: true

volumes:
  specialists-data:
    driver: local
EOF

# Step 4: Create .env file
print_status "Creating environment configuration..."

cat > ${DOCKER_DIR}/.env << EOF
# Specialists Management System Configuration
POSTGRES_PASSWORD=your-postgres-password
SECRET_KEY=$(openssl rand -hex 32)
DOMAIN=aiportal.local
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# Integration URLs
AUTHENTIK_URL=http://77.110.102.190:9000
GRAFANA_URL=http://77.110.102.190:3000
N8N_URL=http://77.110.102.190:5678
EOF

# Step 5: Create database initialization script
print_status "Creating database initialization script..."

cat > ${DOCKER_DIR}/init-db.sql << 'EOF'
-- Create specialists schema if not exists
CREATE SCHEMA IF NOT EXISTS specialists;

-- Import the schema from integration_with_portal.md
\i /docker-entrypoint-initdb.d/specialists-schema.sql

-- Create initial departments
INSERT INTO specialists.departments (code, name) VALUES
    ('IT', 'IT Department'),
    ('MKT', 'Marketing Department'),
    ('OPS', 'Operations Department'),
    ('DEV', 'Development Department')
ON CONFLICT (code) DO NOTHING;

-- Create sample specialists (for testing)
-- In production, these will be created through the API
EOF

# Step 6: Create monitoring configuration
print_status "Creating monitoring configuration..."

mkdir -p ${DOCKER_DIR}/monitoring

cat > ${DOCKER_DIR}/monitoring/prometheus-rules.yml << 'EOF'
groups:
  - name: specialists_monitoring
    interval: 30s
    rules:
      - record: specialists:workload:avg
        expr: avg(specialist_current_workload / specialist_max_tasks) by (department)
        
      - record: specialists:tasks:completion_rate
        expr: rate(tasks_completed_total[5m])
        
      - record: specialists:response_time:p95
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
EOF

# Step 7: Create initial API application
print_status "Creating initial API application..."

cat > ${DOCKER_DIR}/api/main.py << 'EOF'
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="AI Portal Specialists Management API",
    description="API for managing specialists and task distribution",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "AI Portal Specialists Management System",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Import routers
# from routers import specialists, tasks, departments, reports
# app.include_router(specialists.router, prefix="/api/specialists", tags=["specialists"])
# app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
# app.include_router(departments.router, prefix="/api/departments", tags=["departments"])
# app.include_router(reports.router, prefix="/api/reports", tags=["reports"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF

# Step 8: Create worker application
print_status "Creating worker application..."

cat > ${DOCKER_DIR}/worker/worker.py << 'EOF'
import asyncio
import os
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SpecialistsWorker:
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.db_url = os.getenv("DATABASE_URL")
        
    async def run(self):
        logger.info("Specialists Worker started")
        
        while True:
            try:
                # Process task queue
                await self.process_tasks()
                
                # Check for escalations
                await self.check_escalations()
                
                # Update metrics
                await self.update_metrics()
                
                # Sleep for 30 seconds
                await asyncio.sleep(30)
                
            except Exception as e:
                logger.error(f"Error in worker loop: {e}")
                await asyncio.sleep(60)
    
    async def process_tasks(self):
        # TODO: Implement task processing logic
        pass
    
    async def check_escalations(self):
        # TODO: Implement escalation checking logic
        pass
    
    async def update_metrics(self):
        # TODO: Implement metrics update logic
        pass

if __name__ == "__main__":
    worker = SpecialistsWorker()
    asyncio.run(worker.run())
EOF

# Step 9: Create nginx configuration
print_status "Creating nginx configuration..."

mkdir -p ${DOCKER_DIR}/nginx
cat > ${DOCKER_DIR}/nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name reports.specialists.local;

        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ =404;
        }

        location /reports/ {
            alias /usr/share/nginx/html/reports/;
            autoindex on;
        }
    }
}
EOF

# Step 10: Create systemd service (optional)
print_status "Creating systemd service..."

cat > /etc/systemd/system/specialists-management.service << EOF
[Unit]
Description=AI Portal Specialists Management System
Requires=docker.service
After=docker.service

[Service]
Type=simple
WorkingDirectory=${DOCKER_DIR}
ExecStart=/usr/bin/docker-compose up
ExecStop=/usr/bin/docker-compose down
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

# Step 11: Create backup script
print_status "Creating backup script..."

cat > ${PROJECTS_DIR}/scripts/backup/backup-specialists.sh << 'EOF'
#!/bin/bash
# Backup script for specialists management system

BACKUP_DIR="/root/projects/backups/specialists"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/specialists_backup_${TIMESTAMP}.tar.gz"

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Backup database
docker exec postgres pg_dump -U postgres -d aiportal -n specialists > ${BACKUP_DIR}/specialists_db_${TIMESTAMP}.sql

# Backup files
tar -czf ${BACKUP_FILE} \
    /root/projects/docker/specialists/rules \
    /root/projects/docker/specialists/departments \
    /root/projects/docker/specialists/reports \
    /root/projects/docker/specialists/workflows \
    ${BACKUP_DIR}/specialists_db_${TIMESTAMP}.sql

# Remove temporary database dump
rm ${BACKUP_DIR}/specialists_db_${TIMESTAMP}.sql

# Keep only last 7 days of backups
find ${BACKUP_DIR} -name "specialists_backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: ${BACKUP_FILE}"
EOF

chmod +x ${PROJECTS_DIR}/scripts/backup/backup-specialists.sh

# Step 12: Final setup
print_status "Finalizing setup..."

# Set permissions
chmod +x ${DOCKER_DIR}/setup.sh
chmod 600 ${DOCKER_DIR}/.env

# Create symlink to env file
ln -sf ${PROJECTS_DIR}/env ${DOCKER_DIR}/.env

print_success "Setup completed successfully!"

echo ""
echo "📋 Next steps:"
echo "1. Update the .env file with your actual credentials"
echo "2. Run: cd ${DOCKER_DIR} && docker-compose up -d"
echo "3. Access the API at: http://specialists.${DOMAIN:-localhost}"
echo "4. Configure n8n workflows for task automation"
echo "5. Set up Grafana dashboards for monitoring"
echo ""
echo "📚 Documentation:"
echo "- System overview: ${DOCKER_DIR}/experts_management_system.md"
echo "- Integration guide: ${DOCKER_DIR}/integration_with_portal.md"
echo "- Task distribution: ${DOCKER_DIR}/task_distribution_system.md"
echo ""
print_success "🎉 AI Portal Specialists Management System is ready!"