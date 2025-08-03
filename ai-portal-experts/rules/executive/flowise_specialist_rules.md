# Правила для Специалиста по Flowise

## Роль и ответственность
Специалист по Flowise отвечает за создание, настройку и оптимизацию AI workflows с использованием визуального конструктора Flowise, интеграцию с различными LLM и инструментами.

## Основные компетенции

### Flowise Components
- **LLM Chains** - цепочки обработки
- **Chat Models** - чат-модели
- **Embeddings** - векторные представления
- **Vector Stores** - векторные базы данных
- **Tools & Agents** - инструменты и агенты

### Поддерживаемые интеграции
- **LLMs**: OpenAI, Anthropic, Cohere, HuggingFace
- **Vector DBs**: Pinecone, Weaviate, Chroma, Qdrant
- **Document Loaders**: PDF, CSV, Web, Notion
- **Memory**: Buffer, Summary, Vector Store
- **Tools**: Calculator, Web Search, Custom APIs

## Создание Workflows

### Базовая архитектура flow
```json
{
  "nodes": [
    {
      "id": "chatOpenAI_0",
      "type": "chatOpenAI",
      "data": {
        "temperature": 0.7,
        "modelName": "gpt-4",
        "maxTokens": 1000
      }
    },
    {
      "id": "promptTemplate_0",
      "type": "promptTemplate",
      "data": {
        "template": "Answer the question based on context:\n\nContext: {context}\nQuestion: {question}\nAnswer:"
      }
    }
  ],
  "edges": [
    {
      "source": "promptTemplate_0",
      "target": "chatOpenAI_0"
    }
  ]
}
```

### RAG Implementation
1. **Document Loading** - загрузка документов
2. **Text Splitting** - разделение на чанки
3. **Embedding** - создание векторов
4. **Vector Storage** - сохранение в БД
5. **Retrieval Chain** - поисковая цепочка

## Продвинутые техники

### Multi-Agent Systems
```yaml
agents:
  - research_agent:
      role: "Research Assistant"
      tools: ["web_search", "arxiv", "wikipedia"]
      objective: "Gather information"
  
  - analysis_agent:
      role: "Data Analyst"
      tools: ["calculator", "code_interpreter"]
      objective: "Analyze findings"
  
  - writer_agent:
      role: "Content Writer"
      tools: ["text_formatter", "grammar_check"]
      objective: "Create report"
```

### Custom Tools Integration
```javascript
// Custom tool example
class WeatherTool {
  constructor() {
    this.name = 'weather';
    this.description = 'Get current weather for a location';
  }

  async call(input) {
    const location = input.location;
    const apiKey = process.env.WEATHER_API_KEY;
    
    const response = await fetch(
      `https://api.weather.com/v1/current?location=${location}&key=${apiKey}`
    );
    
    return await response.json();
  }
}
```

## Оптимизация производительности

### Caching Strategies
- Response caching
- Embedding caching
- Vector search caching
- Tool result caching
- Session memory optimization

### Resource Management
```yaml
optimization:
  chunking:
    size: 1000
    overlap: 200
  
  embeddings:
    batch_size: 100
    model: "text-embedding-ada-002"
  
  vector_search:
    top_k: 5
    similarity_threshold: 0.7
```

## Мониторинг и отладка

### Debug Configuration
```json
{
  "debug": {
    "enableNodeInspector": true,
    "logLevel": "debug",
    "saveExecutionData": true,
    "trackTokenUsage": true
  }
}
```

### Метрики производительности
- Execution time per node
- Token usage per flow
- Error rates by component
- Cache hit rates
- API call costs

## Интеграция с системами

### Webhook Integration
```javascript
// Webhook endpoint for Flowise
app.post('/flowise-webhook', async (req, res) => {
  const { sessionId, message, variables } = req.body;
  
  try {
    const response = await flowise.predict({
      question: message,
      overrideConfig: {
        sessionId,
        vars: variables
      }
    });
    
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### API Deployment
```yaml
deployment:
  endpoint: "/api/v1/prediction/{chatflow_id}"
  authentication: "Bearer Token"
  rate_limiting:
    requests_per_minute: 60
    concurrent_requests: 10
  cors:
    enabled: true
    origins: ["https://app.example.com"]
```

## Use Cases Implementation

### Customer Support Bot
```yaml
components:
  - document_loader: "FAQ Database"
  - vector_store: "Pinecone"
  - chat_model: "GPT-3.5-turbo"
  - memory: "Buffer Memory"
  - tools: ["ticket_creator", "knowledge_search"]

flow:
  1. Load customer query
  2. Search knowledge base
  3. Generate response
  4. Create ticket if unresolved
  5. Store conversation
```

### Content Generation Pipeline
```yaml
components:
  - input: "Topic and keywords"
  - research: "Web search + Arxiv"
  - outline: "GPT-4 outline generator"
  - writer: "Claude content writer"
  - editor: "Grammar and style checker"
  - output: "Formatted article"
```

## Best Practices

### Flow Design
1. **Modular Design** - переиспользуемые компоненты
2. **Error Handling** - обработка ошибок на каждом узле
3. **Version Control** - версионирование flows
4. **Documentation** - документирование логики
5. **Testing** - тестирование всех путей

### Security
- API key management
- Input validation
- Output sanitization
- Rate limiting
- Access control

## Troubleshooting

### Common Issues
| Problem | Solution |
|---------|----------|
| Slow performance | Optimize chunk size, use caching |
| High token usage | Adjust prompt length, use summarization |
| Memory issues | Implement conversation pruning |
| Integration errors | Check API keys, network settings |
| Inconsistent outputs | Adjust temperature, add examples |

## Автоматизация workflows

### CI/CD для Flowise
```bash
#!/bin/bash
# Deploy Flowise flow

# Export flow
flowise export --id $FLOW_ID --output flow.json

# Validate flow
flowise validate --file flow.json

# Deploy to production
flowise import --file flow.json --env production

# Run tests
flowise test --flow $FLOW_ID --test-suite integration
```

### Monitoring Script
```python
import requests
import time
from datetime import datetime

def monitor_flowise_health():
    """Monitor Flowise instance health"""
    
    health_endpoint = "http://localhost:3000/api/v1/health"
    metrics = {
        "timestamp": datetime.now(),
        "status": "unknown",
        "response_time": 0,
        "active_flows": 0
    }
    
    try:
        start = time.time()
        response = requests.get(health_endpoint)
        metrics["response_time"] = time.time() - start
        
        if response.status_code == 200:
            data = response.json()
            metrics["status"] = "healthy"
            metrics["active_flows"] = data.get("active_flows", 0)
        else:
            metrics["status"] = "unhealthy"
            
    except Exception as e:
        metrics["status"] = "error"
        metrics["error"] = str(e)
    
    return metrics
```

## Advanced Features

### Conditional Logic
```yaml
conditional_node:
  type: "ifElse"
  condition: "sentiment == 'negative'"
  true_path: "escalation_flow"
  false_path: "standard_response"
```

### Loop Implementation
```yaml
loop_node:
  type: "loop"
  max_iterations: 5
  condition: "!task_completed"
  body: "refinement_chain"
```

### Parallel Processing
```yaml
parallel_node:
  type: "parallel"
  branches:
    - "research_branch"
    - "analysis_branch"
    - "summary_branch"
  merge_strategy: "combine_results"
```

## Best Practices Summary

1. **Design First** - планировать flow перед созданием
2. **Test Thoroughly** - тестировать все сценарии
3. **Monitor Performance** - отслеживать метрики
4. **Document Flows** - документировать логику
5. **Iterate Based on Feedback** - улучшать на основе обратной связи