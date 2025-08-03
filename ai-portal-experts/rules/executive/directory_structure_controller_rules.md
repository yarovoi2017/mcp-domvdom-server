# Правила для Контроллера структуры каталогов

## Роль и ответственность
Контроллер структуры каталогов отвечает за поддержание порядка в файловой системе, контроль за соблюдением стандартов организации данных, выявление и устранение проблем с хранением файлов, оптимизацию использования дискового пространства.

## Основные функции

### 1. Мониторинг структуры
- Анализ файловой системы
- Выявление нарушений стандартов
- Поиск дубликатов
- Контроль размеров
- Отслеживание изменений

### 2. Оптимизация хранения
- Архивирование старых данных
- Удаление временных файлов
- Дедупликация
- Сжатие данных
- Реорганизация структуры

### 3. Безопасность данных
- Контроль доступа
- Выявление чувствительных данных
- Мониторинг разрешений
- Аудит изменений
- Compliance проверки

## Стандарты организации каталогов

### Структура проекта
```yaml
project_structure:
  /root/projects/:
    docker/:
      SERVICE_NAME/:
        - docker-compose.yml
        - .env -> /root/projects/env
        - Dockerfile
        - config/
        - volumes/
        - scripts/
        
    scripts/:
      deploy/:
        - "Deployment scripts"
      backup/:
        - "Backup scripts"
      monitoring/:
        - "Monitoring scripts"
      maintenance/:
        - "Maintenance scripts"
        
    data/:
      databases/:
        - "Database dumps"
      uploads/:
        - "User uploads"
      exports/:
        - "Data exports"
      temp/:
        - "Temporary files"
        
    logs/:
      application/:
        - "App logs by date"
      system/:
        - "System logs"
      audit/:
        - "Audit trails"
        
    backups/:
      daily/:
        - "Daily backups"
      weekly/:
        - "Weekly backups"
      monthly/:
        - "Monthly archives"
```

### Naming Conventions
```python
naming_rules = {
    "directories": {
        "format": "lowercase_with_underscores",
        "examples": ["user_data", "log_files", "temp_storage"],
        "forbidden": ["spaces", "special chars except _-", "unicode"]
    },
    
    "files": {
        "format": "descriptive_name_YYYYMMDD",
        "examples": ["backup_20240315.tar.gz", "report_monthly_202403.pdf"],
        "max_length": 255,
        "extensions": "always lowercase"
    },
    
    "docker": {
        "services": "kebab-case",
        "images": "organization/service:tag",
        "volumes": "service_name_volume_type"
    },
    
    "logs": {
        "format": "service_name_YYYYMMDD.log",
        "rotation": "daily",
        "compression": "gzip after 7 days"
    }
}
```

## Инструменты мониторинга

### Directory Scanner
```python
import os
import hashlib
from pathlib import Path
from datetime import datetime
import json

class DirectoryScanner:
    def __init__(self, root_path):
        self.root_path = Path(root_path)
        self.scan_results = {
            "total_files": 0,
            "total_size": 0,
            "file_types": {},
            "large_files": [],
            "duplicates": {},
            "violations": []
        }
        
    def scan_directory(self):
        """Comprehensive directory scan"""
        file_hashes = {}
        
        for path in self.root_path.rglob("*"):
            if path.is_file():
                self.scan_results["total_files"] += 1
                file_size = path.stat().st_size
                self.scan_results["total_size"] += file_size
                
                # Track file types
                extension = path.suffix.lower()
                self.scan_results["file_types"][extension] = \
                    self.scan_results["file_types"].get(extension, 0) + 1
                
                # Find large files
                if file_size > 100 * 1024 * 1024:  # 100MB
                    self.scan_results["large_files"].append({
                        "path": str(path),
                        "size": file_size,
                        "modified": datetime.fromtimestamp(path.stat().st_mtime)
                    })
                
                # Check for duplicates
                file_hash = self.calculate_hash(path)
                if file_hash in file_hashes:
                    if file_hash not in self.scan_results["duplicates"]:
                        self.scan_results["duplicates"][file_hash] = []
                    self.scan_results["duplicates"][file_hash].append(str(path))
                else:
                    file_hashes[file_hash] = str(path)
                
                # Check naming violations
                self.check_naming_conventions(path)
    
    def calculate_hash(self, file_path, chunk_size=8192):
        """Calculate file hash for duplicate detection"""
        hash_md5 = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(chunk_size), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
```

### Permission Auditor
```python
import stat
import pwd
import grp

class PermissionAuditor:
    def __init__(self):
        self.issues = []
        self.sensitive_patterns = [
            "*.key", "*.pem", "*.env", "*secret*",
            "*password*", "*token*", "*.sql"
        ]
        
    def audit_permissions(self, path):
        """Audit file and directory permissions"""
        path_obj = Path(path)
        
        for item in path_obj.rglob("*"):
            stat_info = item.stat()
            mode = stat_info.st_mode
            
            # Check world-readable sensitive files
            if any(item.match(pattern) for pattern in self.sensitive_patterns):
                if mode & stat.S_IROTH:
                    self.issues.append({
                        "type": "world_readable_sensitive",
                        "path": str(item),
                        "permissions": oct(mode)[-3:],
                        "severity": "high"
                    })
            
            # Check world-writable
            if mode & stat.S_IWOTH:
                self.issues.append({
                    "type": "world_writable",
                    "path": str(item),
                    "permissions": oct(mode)[-3:],
                    "severity": "critical"
                })
            
            # Check executable files
            if item.is_file() and mode & stat.S_IXUSR:
                if not self.is_expected_executable(item):
                    self.issues.append({
                        "type": "unexpected_executable",
                        "path": str(item),
                        "severity": "medium"
                    })
```

## Автоматизация очистки

### Cleanup Scheduler
```python
import shutil
from datetime import datetime, timedelta

class CleanupScheduler:
    def __init__(self, config):
        self.config = config
        self.cleanup_rules = {
            "temp_files": {
                "path": "/tmp",
                "older_than_days": 7,
                "pattern": "*"
            },
            "old_logs": {
                "path": "/var/log",
                "older_than_days": 30,
                "pattern": "*.log.*",
                "action": "compress"
            },
            "cache_files": {
                "path": "/var/cache",
                "older_than_days": 14,
                "pattern": "*"
            }
        }
        
    def cleanup_old_files(self, rule):
        """Clean up files based on rules"""
        cleanup_path = Path(rule["path"])
        cutoff_date = datetime.now() - timedelta(days=rule["older_than_days"])
        
        for file_path in cleanup_path.glob(rule["pattern"]):
            if file_path.is_file():
                file_mtime = datetime.fromtimestamp(file_path.stat().st_mtime)
                
                if file_mtime < cutoff_date:
                    if rule.get("action") == "compress":
                        self.compress_file(file_path)
                    else:
                        self.safe_delete(file_path)
    
    def compress_file(self, file_path):
        """Compress old files"""
        import gzip
        
        gz_path = f"{file_path}.gz"
        with open(file_path, 'rb') as f_in:
            with gzip.open(gz_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        
        os.remove(file_path)
```

### Docker Cleanup
```bash
#!/bin/bash
# Docker cleanup script

echo "Cleaning Docker resources..."

# Remove stopped containers
docker container prune -f

# Remove unused images
docker image prune -a -f

# Remove unused volumes
docker volume prune -f

# Remove unused networks
docker network prune -f

# Clean build cache
docker builder prune -f

# Show disk usage
echo "Docker disk usage after cleanup:"
docker system df
```

## Анализ использования пространства

### Disk Usage Analyzer
```python
class DiskUsageAnalyzer:
    def __init__(self):
        self.usage_data = {}
        
    def analyze_directory(self, path):
        """Analyze disk usage by directory"""
        total_size = 0
        dir_sizes = {}
        
        for dirpath, dirnames, filenames in os.walk(path):
            dir_size = 0
            
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                try:
                    dir_size += os.path.getsize(filepath)
                except:
                    pass
                    
            dir_sizes[dirpath] = dir_size
            total_size += dir_size
        
        # Sort by size
        sorted_dirs = sorted(
            dir_sizes.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        return {
            "total_size": total_size,
            "top_directories": sorted_dirs[:20],
            "usage_by_type": self.analyze_by_type(path)
        }
    
    def generate_report(self, analysis):
        """Generate usage report"""
        report = f"""
Disk Usage Report
================
Total Size: {self.format_bytes(analysis['total_size'])}

Top Directories:
"""
        for dir_path, size in analysis['top_directories']:
            report += f"  {self.format_bytes(size):>10} - {dir_path}\n"
            
        return report
```

## Мониторинг изменений

### File System Watcher
```python
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import logging

class DirectoryWatcher(FileSystemEventHandler):
    def __init__(self, watch_path):
        self.watch_path = watch_path
        self.logger = logging.getLogger(__name__)
        
    def on_created(self, event):
        """Handle file creation"""
        if not event.is_directory:
            self.validate_new_file(event.src_path)
            
    def on_modified(self, event):
        """Handle file modification"""
        if not event.is_directory:
            self.check_file_growth(event.src_path)
            
    def on_deleted(self, event):
        """Handle file deletion"""
        self.log_deletion(event.src_path)
        
    def validate_new_file(self, file_path):
        """Validate newly created files"""
        # Check naming convention
        if not self.is_valid_filename(file_path):
            self.logger.warning(f"Invalid filename: {file_path}")
            
        # Check file location
        if self.is_wrong_location(file_path):
            self.logger.warning(f"File in wrong location: {file_path}")
            
        # Check for sensitive data
        if self.contains_sensitive_data(file_path):
            self.logger.critical(f"Sensitive data detected: {file_path}")
```

## Отчетность

### Structure Report Generator
```python
class StructureReportGenerator:
    def __init__(self):
        self.report_data = {}
        
    def generate_health_report(self, scan_results):
        """Generate directory health report"""
        report = {
            "summary": {
                "total_files": scan_results["total_files"],
                "total_size": scan_results["total_size"],
                "duplicate_files": len(scan_results["duplicates"]),
                "space_wasted": self.calculate_wasted_space(scan_results),
                "violations": len(scan_results["violations"])
            },
            
            "recommendations": self.generate_recommendations(scan_results),
            
            "detailed_findings": {
                "large_files": scan_results["large_files"][:10],
                "duplicates": self.format_duplicates(scan_results["duplicates"]),
                "violations": scan_results["violations"]
            }
        }
        
        return report
    
    def generate_recommendations(self, scan_results):
        """Generate actionable recommendations"""
        recommendations = []
        
        if scan_results["duplicates"]:
            recommendations.append({
                "issue": "Duplicate files found",
                "impact": f"{self.calculate_wasted_space(scan_results)} wasted",
                "action": "Run deduplication process"
            })
            
        if scan_results["large_files"]:
            recommendations.append({
                "issue": "Large files detected",
                "impact": "Consuming significant disk space",
                "action": "Archive or compress old large files"
            })
            
        return recommendations
```

## Политики хранения

### Retention Policies
```yaml
retention_policies:
  logs:
    application:
      retention: "30 days"
      compression: "after 7 days"
      archive: "after 30 days"
      
    audit:
      retention: "2 years"
      compression: "after 30 days"
      archive: "never"
      
    security:
      retention: "1 year"
      compression: "after 7 days"
      archive: "after 90 days"
      
  backups:
    daily:
      retention: "7 days"
      cleanup: "automatic"
      
    weekly:
      retention: "4 weeks"
      cleanup: "automatic"
      
    monthly:
      retention: "12 months"
      cleanup: "manual review"
      
  user_data:
    active:
      retention: "unlimited"
      
    inactive:
      retention: "90 days after last access"
      action: "archive then delete"
```

## Security Scanning

### Sensitive Data Scanner
```python
import re

class SensitiveDataScanner:
    def __init__(self):
        self.patterns = {
            "api_key": r"[a-zA-Z0-9]{32,}",
            "aws_key": r"AKIA[0-9A-Z]{16}",
            "email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
            "credit_card": r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b",
            "ssn": r"\b\d{3}-\d{2}-\d{4}\b",
            "private_key": r"-----BEGIN .* PRIVATE KEY-----"
        }
        
    def scan_file(self, file_path):
        """Scan file for sensitive data"""
        findings = []
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
                for data_type, pattern in self.patterns.items():
                    matches = re.finditer(pattern, content)
                    for match in matches:
                        findings.append({
                            "file": file_path,
                            "type": data_type,
                            "line": content[:match.start()].count('\n') + 1,
                            "preview": self.safe_preview(match.group())
                        })
                        
        except Exception as e:
            pass
            
        return findings
```

## Best Practices

1. **Regular Audits** - регулярные проверки структуры
2. **Automation First** - максимальная автоматизация
3. **Clear Standards** - четкие стандарты организации
4. **Proactive Monitoring** - проактивный мониторинг
5. **Security Focus** - приоритет безопасности данных