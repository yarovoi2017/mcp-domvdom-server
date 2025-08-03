# Интеграция системы управления специалистами с AI Portal

## Обзор интеграции

Система управления специалистами интегрируется с существующей инфраструктурой AI Portal через следующие компоненты:

### 1. Authentik (Identity Provider)
- Создание ролей для каждого типа специалиста
- Управление доступами на основе департаментов
- SSO для всех инструментов

### 2. n8n (Automation)
- Автоматизация распределения задач
- Интеграция с системами оповещения
- Workflow для onboarding специалистов

### 3. Grafana (Monitoring)
- Дашборды по департаментам
- KPI специалистов
- Отслеживание эффективности

### 4. Telegram Bot (Notifications)
- Уведомления о новых задачах
- Эскалация проблем
- Статус-репорты

## Настройка интеграции

### Шаг 1: Создание ролей в Authentik

```python
# Script для создания ролей в Authentik
import requests
from typing import List, Dict

AUTHENTIK_URL = "http://77.110.102.190:9000"
AUTHENTIK_TOKEN = "your-api-token"

roles = [
    # Strategic Level
    {"name": "portal_director", "permissions": ["*"]},
    {"name": "development_director", "permissions": ["development.*", "read.*"]},
    {"name": "financial_consultant", "permissions": ["finance.*", "reports.read"]},
    
    # Operational Level
    {"name": "it_department_head", "permissions": ["it.*", "infrastructure.*"]},
    {"name": "operations_head", "permissions": ["operations.*", "processes.*"]},
    {"name": "project_manager", "permissions": ["projects.*", "tasks.*"]},
    
    # Executive Level
    {"name": "programmer", "permissions": ["code.*", "git.*", "deploy.dev"]},
    {"name": "ai_specialist", "permissions": ["ai.*", "models.*", "data.read"]},
    {"name": "marketing_expert", "permissions": ["marketing.*", "content.*"]},
    # ... другие роли
]

def create_roles():
    headers = {"Authorization": f"Bearer {AUTHENTIK_TOKEN}"}
    
    for role in roles:
        response = requests.post(
            f"{AUTHENTIK_URL}/api/v3/rbac/roles/",
            json=role,
            headers=headers
        )
        if response.status_code == 201:
            print(f"Created role: {role['name']}")
        else:
            print(f"Failed to create role: {role['name']}")

if __name__ == "__main__":
    create_roles()
```

### Шаг 2: n8n Workflows

#### Task Distribution Workflow
```json
{
  "name": "AI Portal Task Distribution",
  "nodes": [
    {
      "name": "Webhook - New Task",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "ai-portal/new-task",
        "responseMode": "onReceived"
      }
    },
    {
      "name": "Classify Task",
      "type": "n8n-nodes-base.openAi",
      "parameters": {
        "operation": "text",
        "model": "gpt-4",
        "prompt": "Classify this task into categories: strategic, technical, operational, or marketing. Task: {{$json.task_description}}"
      }
    },
    {
      "name": "Find Specialist",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:8000/api/find-specialist",
        "method": "POST",
        "jsonParameters": true,
        "bodyParametersJson": {
          "category": "={{$json.category}}",
          "skills": "={{$json.required_skills}}",
          "priority": "={{$json.priority}}"
        }
      }
    },
    {
      "name": "Create Jira Ticket",
      "type": "n8n-nodes-base.jira",
      "parameters": {
        "operation": "create",
        "project": "AIPORTAL",
        "issueType": "Task",
        "summary": "={{$json.task_title}}",
        "description": "={{$json.task_description}}",
        "assignee": "={{$json.specialist_email}}"
      }
    },
    {
      "name": "Telegram Notification",
      "type": "n8n-nodes-base.telegram",
      "parameters": {
        "chatId": "={{$json.specialist_telegram_id}}",
        "text": "🆕 New task assigned!\n\n📋 *{{$json.task_title}}*\n\n{{$json.task_description}}\n\n⏰ Priority: {{$json.priority}}\n📅 Deadline: {{$json.deadline}}"
      }
    }
  ]
}
```

### Шаг 3: Grafana Dashboards

```yaml
# Dashboard configuration for specialists monitoring
apiVersion: 1

providers:
  - name: 'AI Portal Specialists'
    orgId: 1
    folder: 'AI Portal'
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /var/lib/grafana/dashboards

dashboards:
  - title: "Specialists Performance Dashboard"
    panels:
      - title: "Tasks by Department"
        type: "piechart"
        targets:
          - expr: "sum by (department) (tasks_completed_total)"
            
      - title: "Average Task Completion Time"
        type: "graph"
        targets:
          - expr: "avg by (specialist) (task_completion_time)"
            
      - title: "KPI Achievement Rate"
        type: "stat"
        targets:
          - expr: "avg(kpi_achievement_rate)"
            
      - title: "Specialist Workload"
        type: "heatmap"
        targets:
          - expr: "specialist_workload_percentage"
```

### Шаг 4: База данных специалистов

```sql
-- PostgreSQL schema for specialists management

CREATE SCHEMA IF NOT EXISTS specialists;

-- Departments table
CREATE TABLE specialists.departments (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    head_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Specialists table
CREATE TABLE specialists.specialists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES auth.users(id),
    department_id INTEGER REFERENCES specialists.departments(id),
    role VARCHAR(50) NOT NULL,
    skills JSONB DEFAULT '[]',
    experience_years INTEGER DEFAULT 0,
    max_concurrent_tasks INTEGER DEFAULT 3,
    current_workload INTEGER DEFAULT 0,
    availability_percentage INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE specialists.tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    assigned_to INTEGER REFERENCES specialists.specialists(id),
    created_by INTEGER REFERENCES auth.users(id),
    deadline TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task assignments log
CREATE TABLE specialists.task_assignments (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES specialists.tasks(id),
    specialist_id INTEGER REFERENCES specialists.specialists(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assignment_reason TEXT,
    score DECIMAL(5,2)
);

-- KPIs table
CREATE TABLE specialists.kpis (
    id SERIAL PRIMARY KEY,
    specialist_id INTEGER REFERENCES specialists.specialists(id),
    metric_name VARCHAR(100) NOT NULL,
    target_value DECIMAL(10,2),
    actual_value DECIMAL(10,2),
    measurement_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_tasks_status ON specialists.tasks(status);
CREATE INDEX idx_tasks_assigned_to ON specialists.tasks(assigned_to);
CREATE INDEX idx_specialists_department ON specialists.specialists(department_id);
CREATE INDEX idx_kpis_specialist_date ON specialists.kpis(specialist_id, measurement_date);
```

### Шаг 5: API для управления специалистами

```python
# FastAPI application for specialists management
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import asyncpg
from datetime import datetime

app = FastAPI(title="AI Portal Specialists API")

class TaskRequest(BaseModel):
    title: str
    description: str
    category: str
    priority: str
    deadline: Optional[datetime]
    required_skills: List[str]

class SpecialistResponse(BaseModel):
    id: int
    name: str
    role: str
    department: str
    current_workload: int
    score: float

@app.post("/api/find-specialist", response_model=SpecialistResponse)
async def find_specialist(task: TaskRequest):
    """Find the best available specialist for a task"""
    
    # Query to find best matching specialist
    query = """
    SELECT 
        s.id,
        u.name,
        s.role,
        d.name as department,
        s.current_workload,
        calculate_specialist_score($1, s.skills, s.current_workload, s.availability_percentage) as score
    FROM specialists.specialists s
    JOIN auth.users u ON s.user_id = u.id
    JOIN specialists.departments d ON s.department_id = d.id
    WHERE 
        d.code = $2
        AND s.current_workload < s.max_concurrent_tasks
        AND s.availability_percentage > 0
    ORDER BY score DESC
    LIMIT 1
    """
    
    # Execute query
    async with get_db_connection() as conn:
        result = await conn.fetchrow(
            query, 
            task.required_skills,
            task.category
        )
        
    if not result:
        raise HTTPException(status_code=404, detail="No available specialist found")
        
    return SpecialistResponse(**dict(result))

@app.post("/api/assign-task")
async def assign_task(task_id: int, specialist_id: int):
    """Assign a task to a specialist"""
    
    async with get_db_connection() as conn:
        # Update task assignment
        await conn.execute(
            """
            UPDATE specialists.tasks 
            SET assigned_to = $1, status = 'assigned'
            WHERE id = $2
            """,
            specialist_id, task_id
        )
        
        # Update specialist workload
        await conn.execute(
            """
            UPDATE specialists.specialists 
            SET current_workload = current_workload + 1
            WHERE id = $1
            """,
            specialist_id
        )
        
        # Log assignment
        await conn.execute(
            """
            INSERT INTO specialists.task_assignments (task_id, specialist_id)
            VALUES ($1, $2)
            """,
            task_id, specialist_id
        )
        
    return {"status": "success", "message": "Task assigned successfully"}

@app.get("/api/departments/{department_code}/metrics")
async def get_department_metrics(department_code: str):
    """Get department performance metrics"""
    
    query = """
    SELECT 
        COUNT(DISTINCT s.id) as total_specialists,
        AVG(s.current_workload::float / s.max_concurrent_tasks) as avg_workload,
        COUNT(t.id) FILTER (WHERE t.status = 'completed' AND t.completed_at >= CURRENT_DATE - INTERVAL '30 days') as tasks_completed_30d,
        AVG(EXTRACT(epoch FROM (t.completed_at - t.created_at))/3600) FILTER (WHERE t.status = 'completed') as avg_completion_hours
    FROM specialists.departments d
    LEFT JOIN specialists.specialists s ON d.id = s.department_id
    LEFT JOIN specialists.tasks t ON s.id = t.assigned_to
    WHERE d.code = $1
    GROUP BY d.id
    """
    
    async with get_db_connection() as conn:
        result = await conn.fetchrow(query, department_code)
        
    return dict(result) if result else {}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Deployment через Docker

```yaml
# docker-compose.yml для системы специалистов
version: '3.8'

services:
  specialists-api:
    build: ./specialists-api
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/aiportal
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - traefik-network
      - internal
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.specialists.rule=Host(`specialists.aiportal.local`)"
      - "traefik.http.services.specialists.loadbalancer.server.port=8000"

  specialists-worker:
    build: ./specialists-worker
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/aiportal
      - REDIS_URL=redis://redis:6379
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
    depends_on:
      - postgres
      - redis
    networks:
      - internal

networks:
  traefik-network:
    external: true
  internal:
    driver: bridge
```

## Мониторинг и алерты

### Prometheus правила

```yaml
groups:
  - name: specialists_alerts
    rules:
      - alert: HighSpecialistWorkload
        expr: avg(specialist_workload_percentage) by (specialist) > 90
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Specialist {{ $labels.specialist }} is overloaded"
          description: "Workload is {{ $value }}% for more than 15 minutes"
          
      - alert: DepartmentTaskBacklog
        expr: sum(tasks_pending) by (department) > 50
        for: 30m
        labels:
          severity: critical
        annotations:
          summary: "High task backlog in {{ $labels.department }}"
          description: "{{ $value }} tasks are pending assignment"
          
      - alert: LowKPIAchievement
        expr: avg(kpi_achievement_rate) by (specialist) < 70
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Low KPI achievement for {{ $labels.specialist }}"
          description: "KPI achievement is {{ $value }}%"
```

## Интеграция с существующими системами

### 1. MinIO для хранения документов
- Отчеты специалистов
- База знаний департаментов
- Шаблоны и процедуры

### 2. Flowise для AI workflows
- Автоматическая классификация задач
- Генерация отчетов
- Анализ эффективности

### 3. Portainer для управления
- Мониторинг контейнеров специалистов
- Управление ресурсами
- Логирование

## Best Practices

1. **Автоматизация** - максимум процессов должно быть автоматизировано
2. **Прозрачность** - все метрики и KPI доступны в реальном времени
3. **Масштабируемость** - система готова к росту количества специалистов
4. **Безопасность** - ролевая модель доступа через Authentik
5. **Мониторинг** - постоянный контроль эффективности