# Правила для Специалиста по No-Code/Low-Code

## Роль и ответственность
Специалист по no-code/low-code отвечает за автоматизацию бизнес-процессов, создание интеграций и разработку решений с минимальным использованием традиционного программирования.

## Основные платформы

### Workflow Automation
- **n8n** - open-source automation
- **Zapier** - cloud automation
- **Make (Integromat)** - visual automation
- **Microsoft Power Automate** - enterprise automation
- **IFTTT** - simple automation

### App Development
- **Bubble** - web applications
- **Webflow** - websites
- **Retool** - internal tools
- **AppSheet** - mobile apps
- **Airtable** - database apps

## n8n Специализация

### Основные концепции
```javascript
// n8n workflow structure
{
  "name": "Customer Onboarding",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "customer-signup",
        "responseMode": "onReceived"
      }
    },
    {
      "name": "Create CRM Record",
      "type": "n8n-nodes-base.salesforce",
      "parameters": {
        "operation": "create",
        "resource": "contact"
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [["Create CRM Record"]]
    }
  }
}
```

### Custom Node Development
```typescript
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class CustomProcessor implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Custom Processor',
    name: 'customProcessor',
    group: ['transform'],
    version: 1,
    description: 'Process data with custom logic',
    defaults: {
      name: 'Custom Processor',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          {
            name: 'Transform',
            value: 'transform',
          },
          {
            name: 'Filter',
            value: 'filter',
          },
        ],
        default: 'transform',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const operation = this.getNodeParameter('operation', 0) as string;
    
    // Process items based on operation
    return this.prepareOutputData(items);
  }
}
```

## Автоматизация процессов

### Business Process Mapping
```yaml
process: "Order Fulfillment"
steps:
  1. trigger: "New Order Webhook"
  2. validate: "Check Inventory"
  3. condition: "In Stock?"
     - true: "Process Payment"
     - false: "Send Backorder Email"
  4. action: "Create Shipping Label"
  5. notify: "Send Confirmation Email"
  6. update: "Update Order Status"
```

### Integration Patterns
1. **Point-to-Point** - прямые интеграции
2. **Hub-and-Spoke** - централизованная логика
3. **Event-Driven** - реактивная архитектура
4. **Batch Processing** - пакетная обработка
5. **Real-time Sync** - синхронизация в реальном времени

## Low-Code Development

### Retool Applications
```javascript
// Retool query example
const getCustomerData = async () => {
  const customerId = {{ table1.selectedRow.id }};
  
  const customerData = await getCustomer.trigger({
    additionalScope: { customerId }
  });
  
  const orderHistory = await getOrders.trigger({
    additionalScope: { customerId }
  });
  
  return {
    customer: customerData,
    orders: orderHistory
  };
};
```

### Bubble.io Logic
```yaml
workflow:
  trigger: "Button Click"
  actions:
    - "Show Loading"
    - "Make API Call"
    - "Process Response"
    - "Update UI State"
    - "Hide Loading"
  error_handling:
    - "Show Error Message"
    - "Log to Analytics"
```

## Интеграционные сценарии

### CRM Integration
```json
{
  "name": "Sync Contacts",
  "trigger": "Every 15 minutes",
  "actions": [
    {
      "service": "Salesforce",
      "action": "Get New Contacts"
    },
    {
      "service": "Transformer",
      "action": "Map Fields"
    },
    {
      "service": "HubSpot",
      "action": "Create/Update Contacts"
    },
    {
      "service": "Slack",
      "action": "Send Summary"
    }
  ]
}
```

### E-commerce Automation
```yaml
triggers:
  - new_order: "WooCommerce Webhook"
  - payment_received: "Stripe Webhook"
  - shipping_update: "ShipStation Webhook"

workflows:
  order_processing:
    - validate_payment
    - update_inventory
    - create_invoice
    - send_confirmation
    - notify_warehouse
    
  customer_communication:
    - send_order_confirmation
    - send_shipping_notification
    - request_review_after_delivery
```

## Оптимизация производительности

### n8n Best Practices
```javascript
// Efficient data handling
const processLargeDataset = {
  // Use streaming for large files
  streamFile: true,
  
  // Process in batches
  batchSize: 100,
  
  // Implement pagination
  pagination: {
    type: 'offset',
    limitParameter: 'limit',
    offsetParameter: 'offset'
  },
  
  // Error handling
  continueOnFail: true,
  
  // Memory optimization
  settings: {
    maxDataSize: '100MB',
    timeout: 300000
  }
};
```

### Resource Management
- Memory limits configuration
- Execution timeout settings
- Concurrent execution limits
- Queue management
- Database connection pooling

## Мониторинг и отладка

### Logging Strategy
```yaml
logging:
  levels:
    - error: "Critical failures"
    - warn: "Performance issues"
    - info: "Workflow executions"
    - debug: "Detailed flow data"
    
  destinations:
    - console: "Development"
    - file: "Production logs"
    - elasticsearch: "Analytics"
    - slack: "Critical alerts"
```

### Performance Metrics
- Execution time per workflow
- Success/failure rates
- Resource utilization
- API call counts
- Error frequency

## Security Considerations

### Credential Management
```javascript
// Secure credential handling
const secureCredentials = {
  type: 'oauth2',
  credentials: {
    clientId: '{{$credentials.clientId}}',
    clientSecret: '{{$credentials.clientSecret}}',
    accessToken: '{{$credentials.accessToken}}',
    refreshToken: '{{$credentials.refreshToken}}'
  },
  // Automatic token refresh
  autoRefresh: true
};
```

### Data Protection
- Encryption at rest
- Secure API endpoints
- Input validation
- Output sanitization
- Audit logging

## Testing Strategies

### Workflow Testing
```yaml
test_suite:
  unit_tests:
    - test_data_transformation
    - test_error_handling
    - test_conditional_logic
    
  integration_tests:
    - test_api_connections
    - test_database_operations
    - test_third_party_services
    
  e2e_tests:
    - test_complete_workflow
    - test_edge_cases
    - test_performance_limits
```

## Documentation Standards

### Workflow Documentation
```markdown
# Workflow: Customer Onboarding

## Purpose
Automate new customer setup across multiple systems

## Trigger
- Webhook from signup form
- Manual execution
- Scheduled batch import

## Steps
1. Validate customer data
2. Create CRM record
3. Setup email sequences
4. Generate welcome packet
5. Notify sales team

## Error Handling
- Validation failures → Send to manual review
- API errors → Retry with exponential backoff
- Complete failures → Alert ops team

## Dependencies
- Salesforce API
- SendGrid API
- Internal customer database
```

## Governance

### Development Standards
1. **Naming Conventions** - четкие имена workflows
2. **Version Control** - git для конфигураций
3. **Change Management** - процесс утверждения
4. **Access Control** - ролевая модель
5. **Compliance** - соответствие регуляциям

### Deployment Process
```bash
# Deployment pipeline
stages:
  - validate: "Check syntax and logic"
  - test: "Run test suite"
  - stage: "Deploy to staging"
  - approve: "Manual approval"
  - production: "Deploy to production"
  - monitor: "Post-deployment checks"
```

## Cost Optimization

### Strategies
1. **Batch Operations** - группировка запросов
2. **Caching** - кэширование результатов
3. **Conditional Execution** - выполнение по условию
4. **Resource Scheduling** - планирование нагрузки
5. **API Quotas** - управление лимитами

## Best Practices

1. **Start Simple** - начинать с простых автоматизаций
2. **Document Everything** - подробная документация
3. **Test Thoroughly** - комплексное тестирование
4. **Monitor Continuously** - постоянный мониторинг
5. **Iterate Based on Metrics** - улучшение на основе данных