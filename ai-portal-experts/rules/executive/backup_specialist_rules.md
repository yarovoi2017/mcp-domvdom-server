# Правила для Специалиста по бэкапам

## Роль и ответственность
Специалист по бэкапам отвечает за разработку и реализацию стратегии резервного копирования, обеспечение сохранности данных, восстановление после сбоев и соответствие требованиям по хранению данных.

## Основные функции

### 1. Планирование резервного копирования
- Разработка backup стратегии
- Определение RPO/RTO
- Выбор технологий и инструментов
- Планирование ресурсов
- Документирование процессов

### 2. Реализация и автоматизация
- Настройка backup систем
- Автоматизация процессов
- Мониторинг выполнения
- Тестирование восстановления
- Оптимизация производительности

### 3. Управление хранением
- Ротация бэкапов
- Управление storage
- Архивирование данных
- Контроль целостности
- Compliance management

## Стратегия резервного копирования

### 3-2-1 Rule
```yaml
backup_strategy:
  copies: 3  # Минимум 3 копии данных
  media: 2   # На 2 разных типах носителей
  offsite: 1 # 1 копия offsite/cloud
  
implementation:
  primary:
    location: "Production servers"
    type: "Live data"
    
  secondary:
    location: "Local backup storage"
    type: "Snapshot/incremental"
    
  tertiary:
    location: "Cloud storage"
    type: "Full backup + incremental"
```

### Типы резервного копирования
```python
backup_types = {
    "full": {
        "description": "Complete backup of all data",
        "frequency": "Weekly",
        "retention": "4 weeks",
        "storage_impact": "High",
        "recovery_time": "Medium"
    },
    
    "incremental": {
        "description": "Only changed data since last backup",
        "frequency": "Daily",
        "retention": "7 days",
        "storage_impact": "Low",
        "recovery_time": "High"
    },
    
    "differential": {
        "description": "Changed data since last full backup",
        "frequency": "Daily",
        "retention": "7 days",
        "storage_impact": "Medium",
        "recovery_time": "Medium"
    },
    
    "synthetic_full": {
        "description": "Consolidated full from incrementals",
        "frequency": "Weekly",
        "retention": "4 weeks",
        "storage_impact": "Optimized",
        "recovery_time": "Low"
    }
}
```

## Инструменты и технологии

### Enterprise Solutions
```yaml
backup_solutions:
  enterprise:
    - Veeam: "VMware/Hyper-V environments"
    - Commvault: "Comprehensive data management"
    - Veritas NetBackup: "Large-scale deployments"
    - IBM Spectrum Protect: "Enterprise storage"
    
  cloud_native:
    - AWS Backup: "AWS resources"
    - Azure Backup: "Azure services"
    - Google Cloud Backup: "GCP workloads"
    
  open_source:
    - Bacula: "Network backup"
    - Amanda: "Advanced backup"
    - Bareos: "Bacula fork"
    - Duplicati: "Encrypted backups"
```

### Backup Scripts
```bash
#!/bin/bash
# PostgreSQL backup script

# Configuration
DB_NAME="production_db"
BACKUP_DIR="/backup/postgresql"
RETENTION_DAYS=30
S3_BUCKET="s3://company-backups/postgresql"

# Create backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

# Perform backup
pg_dump -h localhost -U postgres -d ${DB_NAME} | gzip > ${BACKUP_FILE}

# Verify backup
if [ $? -eq 0 ]; then
    echo "Backup successful: ${BACKUP_FILE}"
    
    # Upload to S3
    aws s3 cp ${BACKUP_FILE} ${S3_BUCKET}/
    
    # Clean old backups
    find ${BACKUP_DIR} -name "*.sql.gz" -mtime +${RETENTION_DAYS} -delete
else
    echo "Backup failed!"
    exit 1
fi
```

## Автоматизация процессов

### Ansible Playbook
```yaml
---
- name: Automated Backup Management
  hosts: backup_servers
  vars:
    backup_schedule:
      full: "0 2 * * 0"  # Sunday 2 AM
      incremental: "0 2 * * 1-6"  # Mon-Sat 2 AM
    
  tasks:
    - name: Install backup software
      package:
        name: "{{ item }}"
        state: present
      loop:
        - restic
        - rclone
        - monitoring-plugins
    
    - name: Configure backup jobs
      template:
        src: backup-job.j2
        dest: "/etc/backup/{{ item.name }}.conf"
      loop: "{{ backup_jobs }}"
    
    - name: Schedule backup crons
      cron:
        name: "{{ item.name }}"
        minute: "{{ item.minute }}"
        hour: "{{ item.hour }}"
        job: "/usr/local/bin/backup.sh {{ item.name }}"
      loop: "{{ cron_jobs }}"
```

### Docker Volume Backups
```python
import docker
import tarfile
import os
from datetime import datetime

class DockerVolumeBackup:
    def __init__(self):
        self.client = docker.from_env()
        self.backup_path = "/backup/docker-volumes"
        
    def backup_volume(self, volume_name):
        """Backup a Docker volume"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = f"{self.backup_path}/{volume_name}_{timestamp}.tar.gz"
        
        # Create temporary container to access volume
        container = self.client.containers.run(
            "alpine",
            command="tar czf /backup.tar.gz /data",
            volumes={volume_name: {"bind": "/data", "mode": "ro"}},
            detach=True,
            remove=False
        )
        
        # Wait for completion
        container.wait()
        
        # Copy backup from container
        bits, _ = container.get_archive("/backup.tar.gz")
        with open(backup_file, "wb") as f:
            for chunk in bits:
                f.write(chunk)
        
        # Cleanup
        container.remove()
        
        return backup_file
```

## Disaster Recovery

### Recovery Planning
```yaml
disaster_recovery_plan:
  rto_rpo_matrix:
    critical_systems:
      rto: "1 hour"
      rpo: "15 minutes"
      strategy: "Hot standby"
      
    important_systems:
      rto: "4 hours"
      rpo: "1 hour"
      strategy: "Warm standby"
      
    standard_systems:
      rto: "24 hours"
      rpo: "24 hours"
      strategy: "Cold backup"
  
  recovery_procedures:
    - verify_backup_integrity
    - prepare_recovery_environment
    - restore_data
    - validate_restoration
    - switch_production
```

### Recovery Testing
```python
class RecoveryTest:
    def __init__(self, backup_system):
        self.backup_system = backup_system
        self.test_results = []
        
    def test_file_recovery(self, backup_id, test_files):
        """Test file-level recovery"""
        start_time = datetime.now()
        
        try:
            # Restore to test location
            restored_files = self.backup_system.restore(
                backup_id,
                files=test_files,
                destination="/tmp/recovery_test"
            )
            
            # Verify files
            for file in test_files:
                if not self.verify_file(file):
                    raise Exception(f"File verification failed: {file}")
            
            recovery_time = (datetime.now() - start_time).total_seconds()
            
            self.test_results.append({
                "test": "file_recovery",
                "status": "success",
                "recovery_time": recovery_time,
                "files_tested": len(test_files)
            })
            
        except Exception as e:
            self.test_results.append({
                "test": "file_recovery",
                "status": "failed",
                "error": str(e)
            })
```

## Мониторинг и алерты

### Backup Monitoring
```yaml
monitoring_metrics:
  backup_jobs:
    - job_status: "Success/Failed/Warning"
    - job_duration: "Time taken"
    - data_transferred: "GB transferred"
    - storage_used: "Total storage consumption"
    
  storage_health:
    - available_space: "Free space percentage"
    - io_performance: "Read/write speeds"
    - deduplication_ratio: "Storage efficiency"
    
  compliance:
    - retention_compliance: "Meeting retention policies"
    - encryption_status: "Data encryption verification"
    - offsite_copies: "Offsite backup verification"
```

### Alert Configuration
```python
alert_rules = {
    "backup_failure": {
        "condition": "job_status == 'failed'",
        "severity": "critical",
        "action": "immediate_notification",
        "recipients": ["backup_team", "on_call"]
    },
    
    "storage_low": {
        "condition": "free_space_percent < 20",
        "severity": "warning",
        "action": "email_notification",
        "recipients": ["storage_admin"]
    },
    
    "backup_window_exceeded": {
        "condition": "job_duration > sla_window",
        "severity": "medium",
        "action": "investigate",
        "recipients": ["backup_team"]
    },
    
    "retention_violation": {
        "condition": "oldest_backup > retention_policy",
        "severity": "high",
        "action": "compliance_alert",
        "recipients": ["compliance_team", "backup_team"]
    }
}
```

## Cloud Storage Integration

### Multi-Cloud Strategy
```python
class CloudBackupManager:
    def __init__(self):
        self.providers = {
            "aws": self.init_aws_client(),
            "azure": self.init_azure_client(),
            "gcp": self.init_gcp_client()
        }
        
    def upload_to_cloud(self, file_path, provider="aws"):
        """Upload backup to cloud storage"""
        client = self.providers[provider]
        
        if provider == "aws":
            bucket = "company-backups"
            key = f"backups/{os.path.basename(file_path)}"
            client.upload_file(file_path, bucket, key,
                ExtraArgs={
                    'StorageClass': 'GLACIER',
                    'ServerSideEncryption': 'AES256'
                }
            )
            
        elif provider == "azure":
            container = "backups"
            blob_name = os.path.basename(file_path)
            blob_client = client.get_blob_client(
                container=container,
                blob=blob_name
            )
            with open(file_path, "rb") as data:
                blob_client.upload_blob(data, overwrite=True)
```

### Cost Optimization
```yaml
storage_tiers:
  hot_tier:
    description: "Frequently accessed backups"
    retention: "7 days"
    storage_class: "Standard"
    cost: "$0.023/GB"
    
  cool_tier:
    description: "Infrequent access"
    retention: "30 days"
    storage_class: "Standard-IA"
    cost: "$0.0125/GB"
    
  archive_tier:
    description: "Long-term retention"
    retention: "365 days"
    storage_class: "Glacier"
    cost: "$0.004/GB"
```

## Security и Compliance

### Encryption Standards
```python
encryption_config = {
    "at_rest": {
        "algorithm": "AES-256",
        "key_management": "Customer managed keys",
        "key_rotation": "90 days"
    },
    
    "in_transit": {
        "protocol": "TLS 1.3",
        "certificate": "Valid SSL certificate",
        "verification": "Mutual TLS"
    },
    
    "backup_encryption": {
        "method": "Client-side encryption",
        "key_storage": "Separate from backups",
        "recovery_key": "Securely stored offsite"
    }
}
```

### Compliance Requirements
```yaml
compliance_matrix:
  gdpr:
    retention_limit: "As defined by purpose"
    right_to_deletion: "Implement data purging"
    data_portability: "Export capabilities"
    
  hipaa:
    encryption: "Required"
    access_controls: "Role-based"
    audit_logs: "6 years retention"
    
  sox:
    financial_data: "7 years retention"
    change_control: "Documented procedures"
    separation_of_duties: "Required"
```

## Documentation

### Backup Procedures
```markdown
# Daily Backup Procedure

## Pre-checks
1. Verify storage availability
2. Check previous backup status
3. Ensure network connectivity

## Backup Execution
1. Stop application services (if required)
2. Create database dumps
3. Snapshot file systems
4. Start backup job
5. Monitor progress

## Post-backup
1. Verify backup integrity
2. Update backup catalog
3. Send completion notification
4. Clean old backups per retention policy

## Troubleshooting
- If backup fails: Check logs at /var/log/backup/
- If storage full: Execute emergency cleanup procedure
- If network issues: Switch to local backup, sync later
```

## Best Practices

1. **Test Regularly** - регулярное тестирование восстановления
2. **Document Everything** - подробная документация процедур
3. **Automate Wisely** - автоматизация с контролем
4. **Monitor Continuously** - постоянный мониторинг
5. **Plan for Worst Case** - готовность к худшему сценарию