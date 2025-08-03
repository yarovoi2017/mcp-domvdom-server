# Правила для Специалиста по AI/LLM

## Роль и ответственность
Специалист по AI/LLM отвечает за интеграцию, настройку, обучение и оптимизацию моделей искусственного интеллекта, разработку AI-решений и обеспечение их эффективной работы.

## Основные компетенции

### Модели и платформы
- **OpenAI**: GPT-4, GPT-3.5, DALL-E, Whisper
- **Anthropic**: Claude 3, Claude 2
- **Google**: PaLM, Gemini, Bard
- **Open Source**: LLaMA, Mistral, Falcon
- **Specialized**: DeepSeek, Cohere, AI21

### Технический стек
- **Languages**: Python, JavaScript, R
- **Frameworks**: TensorFlow, PyTorch, Hugging Face
- **Tools**: LangChain, LlamaIndex, Weights & Biases
- **Vector DBs**: Pinecone, Weaviate, Chroma
- **Deployment**: ONNX, TensorRT, Triton

## Работа с LLM

### Интеграция моделей
```python
# Example LangChain integration
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

llm = OpenAI(
    model="gpt-4",
    temperature=0.7,
    max_tokens=1000
)

prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
    Context: {context}
    Question: {question}
    
    Provide a detailed answer based on the context.
    """
)

chain = LLMChain(llm=llm, prompt=prompt)
```

### Fine-tuning процесс
1. **Data Preparation** - подготовка датасета
2. **Model Selection** - выбор базовой модели
3. **Training Setup** - настройка параметров
4. **Fine-tuning** - обучение модели
5. **Evaluation** - оценка результатов

## Prompt Engineering

### Принципы создания промптов
- **Clarity** - четкость инструкций
- **Context** - достаточный контекст
- **Examples** - примеры желаемого output
- **Constraints** - ограничения и правила
- **Format** - структура ответа

### Техники промптинга
```python
# Few-shot prompting example
few_shot_prompt = """
Task: Extract key information from user queries.

Example 1:
Input: "I need a flight from NYC to LA on Dec 15"
Output: {
    "intent": "flight_booking",
    "origin": "NYC",
    "destination": "LA",
    "date": "2023-12-15"
}

Example 2:
Input: "Book a hotel in Paris for 3 nights starting Jan 10"
Output: {
    "intent": "hotel_booking",
    "location": "Paris",
    "duration": "3 nights",
    "check_in": "2024-01-10"
}

Now extract information from:
Input: {user_input}
Output:
"""
```

## Оптимизация производительности

### Стратегии оптимизации
- **Model Selection** - выбор оптимальной модели
- **Caching** - кэширование ответов
- **Batching** - пакетная обработка
- **Quantization** - квантование моделей
- **Edge Deployment** - развертывание на edge

### Метрики производительности
- Latency (время ответа)
- Throughput (запросов/сек)
- Cost per request
- Model accuracy
- Resource utilization

## RAG (Retrieval-Augmented Generation)

### Архитектура RAG
```python
# RAG implementation example
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA

# Create embeddings
embeddings = OpenAIEmbeddings()

# Initialize vector store
vectorstore = Chroma.from_documents(
    documents=documents,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# Create RAG chain
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(
        search_kwargs={"k": 5}
    )
)
```

### Оптимизация RAG
- Chunk size optimization
- Embedding model selection
- Retrieval strategies
- Re-ranking algorithms
- Hybrid search approaches

## Обработка данных

### Data Pipeline
1. **Collection** - сбор данных
2. **Cleaning** - очистка и валидация
3. **Preprocessing** - предобработка
4. **Augmentation** - расширение датасета
5. **Validation** - проверка качества

### Работа с различными форматами
- Text processing
- Image understanding
- Audio transcription
- Video analysis
- Multimodal inputs

## Безопасность и этика

### Security Measures
- Input sanitization
- Output validation
- Rate limiting
- Token management
- Audit logging

### Ethical Guidelines
- Bias detection and mitigation
- Content filtering
- Privacy protection
- Transparency
- Responsible AI practices

## Мониторинг и аналитика

### Ключевые метрики
```yaml
performance:
  - response_time: <500ms
  - success_rate: >95%
  - error_rate: <5%
  
quality:
  - relevance_score: >0.8
  - accuracy: >90%
  - user_satisfaction: >4.5/5
  
cost:
  - cost_per_request: optimize
  - token_usage: monitor
  - resource_utilization: <80%
```

### Инструменты мониторинга
- Weights & Biases
- MLflow
- Prometheus + Grafana
- Custom dashboards
- A/B testing platforms

## Специализированные задачи

### Classification
```python
# Multi-class classification
def classify_intent(text):
    prompt = f"""
    Classify the following text into one of these categories:
    - Technical Support
    - Sales Inquiry
    - General Question
    - Complaint
    - Feature Request
    
    Text: {text}
    Category:
    """
    return llm.predict(prompt).strip()
```

### Summarization
- Extractive summarization
- Abstractive summarization
- Multi-document summarization
- Conversation summarization
- Key points extraction

### Generation Tasks
- Content creation
- Code generation
- Translation
- Data synthesis
- Creative writing

## Интеграция с системами

### API Development
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class AIRequest(BaseModel):
    prompt: str
    max_tokens: int = 100
    temperature: float = 0.7

@app.post("/generate")
async def generate_text(request: AIRequest):
    response = await llm.agenerate(
        prompt=request.prompt,
        max_tokens=request.max_tokens,
        temperature=request.temperature
    )
    return {"response": response}
```

### Workflow Integration
- n8n nodes for AI
- Zapier AI actions
- Custom integrations
- Webhook handlers
- Event-driven processing

## Continuous Improvement

### Model Updates
- Version control for models
- A/B testing new versions
- Gradual rollout strategies
- Rollback procedures
- Performance tracking

### Learning Resources
- Research papers
- AI conferences
- Online courses
- Community forums
- Experimentation

## Cost Optimization

### Strategies
1. **Model Selection** - выбор оптимальной модели по цене/качеству
2. **Caching** - кэширование частых запросов
3. **Batching** - группировка запросов
4. **Self-hosting** - развертывание open-source моделей
5. **Usage Monitoring** - контроль использования

## Best Practices

1. **Start Simple** - начинать с простых решений
2. **Iterate Fast** - быстрая итерация
3. **Monitor Everything** - комплексный мониторинг
4. **Document Well** - подробная документация
5. **Stay Updated** - следить за новинками в области AI