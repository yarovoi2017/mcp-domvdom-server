# Правила для Промт-инженера

## Роль и ответственность
Промт-инженер отвечает за создание, оптимизацию и тестирование промптов для различных AI-моделей, обеспечивая максимальную эффективность и точность ответов.

## Основные принципы промптинга

### Структура эффективного промпта
1. **Context** - контекст задачи
2. **Instruction** - четкая инструкция
3. **Input** - входные данные
4. **Output Format** - формат ответа
5. **Examples** - примеры (при необходимости)

### Базовый шаблон
```markdown
You are a {role} with expertise in {domain}.

Your task is to {specific_task}.

Context: {relevant_context}

Requirements:
- {requirement_1}
- {requirement_2}
- {requirement_3}

Input: {user_input}

Please provide your response in the following format:
{output_format}
```

## Техники промптинга

### Zero-shot Prompting
```python
zero_shot_prompt = """
Classify the sentiment of the following text as positive, negative, or neutral.

Text: "The product exceeded my expectations. Great quality!"
Sentiment:
"""
```

### Few-shot Learning
```python
few_shot_prompt = """
Extract entities from the text:

Example 1:
Text: "Apple Inc. announced new iPhone 15 in Cupertino"
Entities: {
    "organizations": ["Apple Inc."],
    "products": ["iPhone 15"],
    "locations": ["Cupertino"]
}

Example 2:
Text: "Microsoft CEO Satya Nadella visited London office"
Entities: {
    "organizations": ["Microsoft"],
    "persons": ["Satya Nadella"],
    "locations": ["London"]
}

Now extract entities from:
Text: "{input_text}"
Entities:
"""
```

### Chain-of-Thought (CoT)
```python
cot_prompt = """
Solve this problem step by step:

Problem: If a train travels 120 km in 2 hours, and then 180 km in 3 hours, 
what is its average speed for the entire journey?

Let's think through this step-by-step:
1. First, calculate the total distance traveled
2. Then, calculate the total time taken
3. Finally, divide total distance by total time

Solution:
"""
```

## Специализированные промпты

### Для анализа данных
```python
data_analysis_prompt = """
You are a data analyst. Analyze the following dataset and provide insights.

Dataset: {dataset}

Please provide:
1. Key statistics (mean, median, mode, standard deviation)
2. Identified patterns or trends
3. Anomalies or outliers
4. Actionable recommendations

Format your response as a structured report.
"""
```

### Для генерации кода
```python
code_generation_prompt = """
You are an expert Python developer. Write a function that {task_description}.

Requirements:
- Use type hints
- Include docstring
- Handle edge cases
- Write efficient code
- Add comments for complex logic

Function signature: {function_signature}

Include example usage and unit tests.
"""
```

### Для контента
```python
content_prompt = """
Create a {content_type} about {topic} for {target_audience}.

Tone: {tone}
Length: {word_count} words
Key points to cover:
{key_points}

SEO keywords to include: {keywords}

Structure:
- Engaging introduction
- Main body with subheadings
- Conclusion with call-to-action
"""
```

## Оптимизация промптов

### A/B Testing Framework
```python
class PromptTester:
    def __init__(self, llm):
        self.llm = llm
        self.results = []
    
    def test_prompts(self, prompts, test_cases):
        for prompt in prompts:
            accuracy = 0
            for test_case in test_cases:
                result = self.llm.invoke(
                    prompt.format(**test_case['input'])
                )
                if self.evaluate(result, test_case['expected']):
                    accuracy += 1
            
            self.results.append({
                'prompt': prompt,
                'accuracy': accuracy / len(test_cases)
            })
        
        return self.get_best_prompt()
```

### Метрики оценки
- **Accuracy** - точность ответов
- **Relevance** - релевантность
- **Completeness** - полнота
- **Consistency** - последовательность
- **Token Efficiency** - эффективность использования токенов

## Prompt Templates Library

### Customer Support
```yaml
template_name: customer_support_response
variables:
  - customer_name
  - issue_description
  - sentiment
  - priority
prompt: |
  You are a customer support specialist. 
  
  Customer: {customer_name}
  Issue: {issue_description}
  Detected Sentiment: {sentiment}
  Priority: {priority}
  
  Craft a professional, empathetic response that:
  1. Acknowledges the issue
  2. Shows understanding
  3. Provides a solution or next steps
  4. Maintains brand voice
```

### Technical Documentation
```yaml
template_name: api_documentation
variables:
  - endpoint
  - method
  - parameters
  - response_format
prompt: |
  Generate API documentation for:
  
  Endpoint: {endpoint}
  Method: {method}
  Parameters: {parameters}
  
  Include:
  - Description
  - Request examples (curl, Python, JavaScript)
  - Response examples
  - Error codes
  - Rate limiting info
```

## Безопасность промптов

### Injection Prevention
```python
def sanitize_input(user_input):
    """Prevent prompt injection attacks"""
    # Remove potential injection patterns
    dangerous_patterns = [
        "ignore previous instructions",
        "disregard all prior",
        "system:",
        "assistant:",
    ]
    
    sanitized = user_input
    for pattern in dangerous_patterns:
        sanitized = sanitized.replace(pattern, "")
    
    return sanitized.strip()
```

### Output Validation
```python
def validate_output(response, expected_format):
    """Validate LLM output matches expected format"""
    if expected_format == "json":
        try:
            json.loads(response)
            return True
        except:
            return False
    elif expected_format == "list":
        return isinstance(response, list)
    # Add more validation rules
```

## Многоязычные промпты

### Шаблон для перевода
```python
translation_prompt = """
You are a professional translator specializing in {domain}.

Translate the following text from {source_language} to {target_language}.
Maintain the original tone, style, and technical accuracy.

Original text: {text}

Translation guidelines:
- Preserve technical terms where appropriate
- Adapt cultural references for the target audience
- Maintain formatting and structure

Translation:
"""
```

## Отладка и улучшение

### Debugging Checklist
- [ ] Промпт ясный и однозначный?
- [ ] Есть ли противоречивые инструкции?
- [ ] Достаточно ли контекста?
- [ ] Указан ли формат вывода?
- [ ] Протестирован на edge cases?

### Iterative Improvement
1. **Baseline** - создать базовый промпт
2. **Test** - протестировать на реальных данных
3. **Analyze** - проанализировать ошибки
4. **Refine** - улучшить промпт
5. **Validate** - проверить улучшения

## Интеграция с системами

### Prompt Management System
```python
class PromptManager:
    def __init__(self, storage):
        self.storage = storage
        self.cache = {}
    
    def get_prompt(self, name, version=None):
        """Retrieve prompt by name and version"""
        key = f"{name}:{version or 'latest'}"
        
        if key in self.cache:
            return self.cache[key]
        
        prompt = self.storage.get(name, version)
        self.cache[key] = prompt
        return prompt
    
    def save_prompt(self, name, content, metadata):
        """Save new prompt version"""
        version = self.storage.save(name, content, metadata)
        return version
```

## Best Practices

### DO's
1. **Be Specific** - четкие инструкции
2. **Provide Context** - достаточный контекст
3. **Use Examples** - примеры для сложных задач
4. **Test Thoroughly** - тщательное тестирование
5. **Version Control** - контроль версий промптов

### DON'Ts
1. **Avoid Ambiguity** - избегать двусмысленности
2. **Don't Overload** - не перегружать инструкциями
3. **Skip Redundancy** - убирать избыточность
4. **No Contradictions** - исключить противоречия
5. **Avoid Bias** - минимизировать предвзятость

## Метрики и мониторинг

### Ключевые показатели
- Success rate по типам задач
- Average token usage
- Response quality scores
- User satisfaction ratings
- Cost per successful prompt

### Dashboard метрики
```yaml
prompt_metrics:
  performance:
    success_rate: 95%
    avg_tokens: 250
    response_time: 1.2s
  
  quality:
    accuracy: 92%
    relevance: 4.5/5
    completeness: 88%
  
  efficiency:
    cost_per_request: $0.02
    cache_hit_rate: 65%
    reuse_rate: 40%
```

## Continuous Learning

### Области развития
- Новые модели и их особенности
- Advanced prompting techniques
- Domain-specific optimizations
- Multilingual capabilities
- Multimodal prompting

### Ресурсы
- OpenAI Cookbook
- Anthropic Prompt Library
- Research papers on prompting
- Community best practices
- Experimental playground