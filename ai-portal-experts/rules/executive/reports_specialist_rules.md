# Правила для Специалиста по отчетам

## Роль и ответственность
Специалист по отчетам отвечает за сбор, анализ и визуализацию данных, создание автоматизированных отчетов, мониторинг KPI и предоставление аналитических insights для принятия решений.

## Основные функции

### 1. Создание отчетов
- Разработка дашбордов
- Автоматизация отчетности
- Визуализация данных
- Интерактивные отчеты
- Real-time мониторинг

### 2. Анализ данных
- Статистический анализ
- Прогнозирование трендов
- Выявление аномалий
- Корреляционный анализ
- Сегментация данных

### 3. Коммуникация результатов
- Executive summaries
- Презентации для руководства
- Рекомендации по улучшению
- Alerts и уведомления
- Документация процессов

## Инструменты и технологии

### BI Platforms
```yaml
business_intelligence:
  enterprise:
    - Power BI: "Microsoft ecosystem"
    - Tableau: "Advanced visualizations"
    - Qlik Sense: "Associative model"
    - Looker: "Google Cloud integration"
    
  open_source:
    - Apache Superset: "Modern BI"
    - Metabase: "Simple analytics"
    - Redash: "SQL-based"
    - Grafana: "Time-series data"
```

### Data Processing
```python
# ETL Pipeline example
import pandas as pd
import numpy as np
from sqlalchemy import create_engine

class DataPipeline:
    def __init__(self, config):
        self.engine = create_engine(config['database_url'])
        self.transformations = []
        
    def extract(self, query):
        """Extract data from source"""
        return pd.read_sql(query, self.engine)
    
    def transform(self, df):
        """Apply transformations"""
        # Clean data
        df = df.dropna(subset=['critical_columns'])
        
        # Calculate metrics
        df['conversion_rate'] = df['conversions'] / df['visits']
        df['avg_order_value'] = df['revenue'] / df['orders']
        
        # Add time dimensions
        df['week'] = pd.to_datetime(df['date']).dt.isocalendar().week
        df['quarter'] = pd.to_datetime(df['date']).dt.quarter
        
        return df
    
    def load(self, df, table_name):
        """Load to destination"""
        df.to_sql(table_name, self.engine, if_exists='replace', index=False)
```

## Типы отчетов

### Operational Reports
```yaml
daily_reports:
  sales_dashboard:
    metrics:
      - daily_revenue
      - orders_count
      - conversion_rate
      - avg_basket_size
    
  performance_report:
    metrics:
      - system_uptime
      - response_time
      - error_rate
      - active_users
    
  support_metrics:
    metrics:
      - tickets_created
      - resolution_time
      - customer_satisfaction
      - escalation_rate
```

### Strategic Reports
```yaml
monthly_reports:
  executive_summary:
    sections:
      - key_achievements
      - financial_performance
      - market_analysis
      - strategic_initiatives
    
  department_reviews:
    include:
      - goals_vs_actual
      - resource_utilization
      - project_status
      - risk_assessment
```

## Автоматизация отчетности

### Scheduling System
```python
from datetime import datetime, timedelta
import schedule
import time

class ReportScheduler:
    def __init__(self):
        self.jobs = []
        
    def schedule_daily_report(self, report_func, time_str):
        """Schedule daily report at specific time"""
        schedule.every().day.at(time_str).do(report_func)
        
    def schedule_weekly_report(self, report_func, day, time_str):
        """Schedule weekly report"""
        getattr(schedule.every(), day.lower()).at(time_str).do(report_func)
        
    def schedule_monthly_report(self, report_func, day_of_month):
        """Schedule monthly report"""
        def run_monthly():
            if datetime.now().day == day_of_month:
                report_func()
        
        schedule.every().day.at("09:00").do(run_monthly)
    
    def run_scheduler(self):
        """Run the scheduler"""
        while True:
            schedule.run_pending()
            time.sleep(60)
```

### Email Distribution
```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

class ReportDistributor:
    def __init__(self, smtp_config):
        self.smtp_config = smtp_config
        
    def send_report(self, recipients, subject, body, attachments=None):
        """Send report via email"""
        msg = MIMEMultipart()
        msg['From'] = self.smtp_config['sender']
        msg['To'] = ', '.join(recipients)
        msg['Subject'] = subject
        
        # Add body
        msg.attach(MIMEText(body, 'html'))
        
        # Add attachments
        if attachments:
            for file_path in attachments:
                self.attach_file(msg, file_path)
        
        # Send email
        with smtplib.SMTP(self.smtp_config['host'], self.smtp_config['port']) as server:
            server.starttls()
            server.login(self.smtp_config['user'], self.smtp_config['password'])
            server.send_message(msg)
```

## Визуализация данных

### Chart Selection Guide
```yaml
chart_types:
  comparison:
    - bar_chart: "Compare categories"
    - column_chart: "Time series comparison"
    - radar_chart: "Multiple variables"
    
  trend:
    - line_chart: "Show trends over time"
    - area_chart: "Cumulative trends"
    - sparkline: "Micro trends"
    
  composition:
    - pie_chart: "Part of whole"
    - stacked_bar: "Component breakdown"
    - treemap: "Hierarchical data"
    
  relationship:
    - scatter_plot: "Correlation"
    - bubble_chart: "Three variables"
    - heatmap: "Matrix relationships"
```

### Dashboard Design Principles
```python
dashboard_config = {
    "layout": {
        "grid": "12 columns",
        "responsive": True,
        "mobile_friendly": True
    },
    
    "visual_hierarchy": {
        "primary_metrics": "Top row, large cards",
        "trends": "Middle section, line charts",
        "details": "Bottom section, tables"
    },
    
    "color_scheme": {
        "success": "#10B981",
        "warning": "#F59E0B",
        "danger": "#EF4444",
        "neutral": "#6B7280"
    },
    
    "interactivity": {
        "filters": "Date range, department, product",
        "drill_down": "Click for details",
        "export": "PDF, Excel, CSV"
    }
}
```

## Data Quality Management

### Validation Rules
```python
class DataValidator:
    def __init__(self):
        self.validation_rules = {}
        
    def add_rule(self, column, rule_type, params=None):
        """Add validation rule"""
        self.validation_rules[column] = {
            'type': rule_type,
            'params': params
        }
    
    def validate_completeness(self, df, required_columns):
        """Check for missing data"""
        missing = df[required_columns].isnull().sum()
        return {
            'missing_counts': missing.to_dict(),
            'completeness_score': 1 - (missing.sum() / (len(df) * len(required_columns)))
        }
    
    def validate_accuracy(self, df, rules):
        """Check data accuracy"""
        issues = []
        for column, rule in rules.items():
            if rule['type'] == 'range':
                min_val, max_val = rule['params']
                invalid = df[(df[column] < min_val) | (df[column] > max_val)]
                if len(invalid) > 0:
                    issues.append({
                        'column': column,
                        'issue': 'out_of_range',
                        'count': len(invalid)
                    })
        return issues
```

## Алерты и мониторинг

### Alert Configuration
```yaml
alert_rules:
  business_metrics:
    revenue_drop:
      condition: "daily_revenue < 0.8 * avg_revenue_7d"
      severity: "high"
      recipients: ["executives", "finance"]
      
    conversion_decline:
      condition: "conversion_rate < 0.9 * avg_conversion_30d"
      severity: "medium"
      recipients: ["marketing", "product"]
      
  system_metrics:
    high_error_rate:
      condition: "error_rate > 5%"
      severity: "critical"
      recipients: ["tech_team", "on_call"]
      
    slow_response:
      condition: "avg_response_time > 2000ms"
      severity: "medium"
      recipients: ["infrastructure"]
```

### Real-time Monitoring
```python
import asyncio
from datetime import datetime

class MetricsMonitor:
    def __init__(self, metrics_source, alert_manager):
        self.metrics_source = metrics_source
        self.alert_manager = alert_manager
        self.thresholds = {}
        
    async def monitor_metric(self, metric_name, threshold, interval=60):
        """Monitor a specific metric"""
        while True:
            current_value = await self.metrics_source.get_metric(metric_name)
            
            if self.check_threshold(current_value, threshold):
                await self.alert_manager.send_alert({
                    'metric': metric_name,
                    'value': current_value,
                    'threshold': threshold,
                    'timestamp': datetime.now()
                })
            
            await asyncio.sleep(interval)
    
    def check_threshold(self, value, threshold):
        """Check if threshold is breached"""
        if threshold['type'] == 'greater_than':
            return value > threshold['value']
        elif threshold['type'] == 'less_than':
            return value < threshold['value']
        elif threshold['type'] == 'range':
            return value < threshold['min'] or value > threshold['max']
```

## Интеграция с системами

### Data Sources
```yaml
data_sources:
  databases:
    - postgresql: "Main application DB"
    - mysql: "Legacy systems"
    - mongodb: "NoSQL data"
    - clickhouse: "Analytics DB"
    
  apis:
    - google_analytics: "Web analytics"
    - salesforce: "CRM data"
    - stripe: "Payment data"
    - mixpanel: "Product analytics"
    
  files:
    - csv: "Manual uploads"
    - excel: "Finance reports"
    - json: "API exports"
    - parquet: "Big data files"
```

### API Development
```python
from fastapi import FastAPI, Query
from typing import Optional
import pandas as pd

app = FastAPI()

@app.get("/api/reports/sales")
async def get_sales_report(
    start_date: str = Query(...),
    end_date: str = Query(...),
    group_by: Optional[str] = Query(None),
    format: str = Query("json", regex="^(json|csv|excel)$")
):
    """Get sales report API"""
    # Fetch data
    data = fetch_sales_data(start_date, end_date)
    
    # Apply grouping if requested
    if group_by:
        data = data.groupby(group_by).agg({
            'revenue': 'sum',
            'orders': 'count',
            'customers': 'nunique'
        })
    
    # Return in requested format
    if format == "json":
        return data.to_dict(orient='records')
    elif format == "csv":
        return data.to_csv()
    elif format == "excel":
        return create_excel_response(data)
```

## Report Templates

### Executive Dashboard
```yaml
executive_dashboard:
  header:
    - company_logo
    - report_date
    - report_period
    
  kpi_section:
    - total_revenue:
        value: "$1.2M"
        change: "+15%"
        chart: "sparkline"
    - active_users:
        value: "45,320"
        change: "+8%"
        chart: "sparkline"
    - customer_satisfaction:
        value: "4.5/5"
        change: "+0.2"
        chart: "gauge"
    
  charts_section:
    - revenue_trend: "line_chart"
    - user_growth: "area_chart"
    - market_share: "pie_chart"
    - geographic_distribution: "map"
```

## Compliance и Documentation

### Report Governance
```yaml
governance:
  data_privacy:
    - anonymize_pii
    - aggregate_sensitive_data
    - comply_with_gdpr
    
  audit_trail:
    - log_report_access
    - track_data_changes
    - version_control
    
  retention_policy:
    - daily_reports: "30 days"
    - monthly_reports: "2 years"
    - annual_reports: "7 years"
```

## Best Practices

1. **Accuracy First** - точность данных превыше всего
2. **Visual Clarity** - понятная визуализация
3. **Actionable Insights** - практические рекомендации
4. **Automation** - максимальная автоматизация
5. **User-Centric** - фокус на потребностях пользователей