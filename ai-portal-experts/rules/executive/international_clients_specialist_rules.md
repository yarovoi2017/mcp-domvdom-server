# Правила для Специалиста по работе с иностранными клиентами

## Роль и ответственность
Специалист по работе с иностранными клиентами отвечает за развитие международного бизнеса, кросс-культурную коммуникацию, локализацию продуктов и услуг, управление международными проектами.

## Языковые компетенции

### Требуемые языки
```yaml
languages:
  required:
    english:
      level: "C1/C2 (Advanced/Proficient)"
      skills: ["Business English", "Technical English", "Negotiation"]
    
  additional:
    spanish:
      level: "B2+ (Upper Intermediate)"
      markets: ["LATAM", "Spain"]
    
    chinese:
      level: "B1+ (Intermediate)"
      markets: ["China", "Taiwan", "Singapore"]
    
    german:
      level: "B2 (Upper Intermediate)"
      markets: ["DACH region"]
```

## Региональные стратегии

### Ключевые рынки
```yaml
market_priorities:
  tier_1:
    north_america:
      countries: ["USA", "Canada"]
      approach: "Direct sales, partnerships"
      challenges: "Competition, regulations"
    
    europe:
      countries: ["UK", "Germany", "France", "Netherlands"]
      approach: "GDPR compliance, local partners"
      challenges: "Diverse regulations, languages"
  
  tier_2:
    asia_pacific:
      countries: ["Singapore", "Japan", "Australia"]
      approach: "Local representatives, cultural adaptation"
      challenges: "Time zones, cultural differences"
    
    middle_east:
      countries: ["UAE", "Saudi Arabia", "Israel"]
      approach: "Regional partnerships, localization"
      challenges: "Business customs, regulations"
```

## Культурные особенности

### Business Etiquette Guide
```python
cultural_guidelines = {
    "usa": {
        "communication": "Direct, informal",
        "meetings": "Punctual, agenda-driven",
        "decision_making": "Quick, data-driven",
        "relationship": "Professional first"
    },
    
    "japan": {
        "communication": "Indirect, formal",
        "meetings": "Consensus-building, patient",
        "decision_making": "Group consensus, slow",
        "relationship": "Relationship first"
    },
    
    "germany": {
        "communication": "Direct, formal",
        "meetings": "Highly punctual, structured",
        "decision_making": "Thorough, process-oriented",
        "relationship": "Professional, reliable"
    },
    
    "brazil": {
        "communication": "Warm, relationship-focused",
        "meetings": "Flexible timing, social",
        "decision_making": "Relationship-influenced",
        "relationship": "Personal connection important"
    }
}
```

## Коммуникационные стратегии

### Time Zone Management
```yaml
communication_schedule:
  americas:
    est: "9 AM - 6 PM EST"
    pst: "9 AM - 6 PM PST"
    overlap_with_europe: "9 AM - 12 PM EST"
    
  europe:
    cet: "9 AM - 6 PM CET"
    gmt: "9 AM - 6 PM GMT"
    overlap_with_asia: "3 PM - 6 PM CET"
    
  asia:
    jst: "9 AM - 6 PM JST"
    ist: "9 AM - 6 PM IST"
    overlap_with_europe: "9 AM - 12 PM JST"
```

### Communication Channels
```yaml
preferred_channels:
  formal:
    - email: "Contracts, proposals"
    - video_calls: "Negotiations, presentations"
    
  informal:
    - whatsapp: "LATAM, Middle East, Asia"
    - wechat: "China"
    - slack: "Tech companies"
    - telegram: "Eastern Europe, Russia"
```

## Локализация

### Product Localization
```python
localization_checklist = {
    "language": {
        "ui_translation": "Professional native speakers",
        "documentation": "Technical writers",
        "marketing_materials": "Transcreation",
        "legal_documents": "Certified translation"
    },
    
    "cultural_adaptation": {
        "images": "Culturally appropriate",
        "colors": "Cultural significance check",
        "features": "Local requirements",
        "examples": "Local context"
    },
    
    "technical": {
        "date_format": "DD/MM/YYYY vs MM/DD/YYYY",
        "currency": "Local currency support",
        "measurements": "Metric vs Imperial",
        "phone_formats": "International formats"
    },
    
    "compliance": {
        "data_privacy": "GDPR, CCPA, etc.",
        "payment_methods": "Local preferences",
        "tax_requirements": "VAT, GST, etc.",
        "industry_standards": "Local certifications"
    }
}
```

## Sales Process

### International Sales Cycle
```yaml
sales_stages:
  1_discovery:
    duration: "1-2 weeks"
    activities:
      - needs_assessment
      - cultural_alignment
      - budget_discussion
      - decision_maker_identification
      
  2_proposal:
    duration: "2-3 weeks"
    activities:
      - localized_proposal
      - pricing_in_local_currency
      - roi_calculation
      - reference_checks
      
  3_negotiation:
    duration: "2-4 weeks"
    considerations:
      - payment_terms
      - contract_localization
      - support_arrangements
      - implementation_timeline
      
  4_closing:
    duration: "1-2 weeks"
    requirements:
      - legal_review
      - international_contracts
      - payment_processing
      - onboarding_plan
```

### Pricing Strategies
```python
def calculate_international_pricing(base_price, market):
    pricing_factors = {
        "purchasing_power": get_ppp_index(market),
        "competition": analyze_local_competition(market),
        "taxes_duties": calculate_local_taxes(market),
        "currency_risk": assess_currency_volatility(market),
        "market_maturity": evaluate_market_readiness(market)
    }
    
    adjusted_price = base_price
    for factor, value in pricing_factors.items():
        adjusted_price *= value
    
    return {
        "local_price": adjusted_price,
        "currency": market["currency"],
        "payment_terms": determine_payment_terms(market),
        "discounts": calculate_volume_discounts(market)
    }
```

## Partnership Development

### Partner Types
```yaml
partner_categories:
  distributors:
    responsibilities: ["Local sales", "First-line support", "Marketing"]
    commission: "20-30%"
    requirements: ["Local presence", "Industry expertise", "Financial stability"]
    
  resellers:
    responsibilities: ["Sales", "Basic support"]
    commission: "15-25%"
    requirements: ["Sales team", "Customer base", "Market knowledge"]
    
  technology_partners:
    responsibilities: ["Integration", "Joint solutions", "Technical support"]
    model: "Revenue sharing"
    requirements: ["Technical expertise", "Complementary products"]
    
  consultants:
    responsibilities: ["Implementation", "Training", "Customization"]
    model: "Project-based"
    requirements: ["Certified professionals", "Local presence"]
```

## Customer Success International

### Onboarding Process
```yaml
international_onboarding:
  week_1:
    - welcome_call_local_time
    - account_setup_local_language
    - documentation_delivery
    - cultural_orientation
    
  week_2:
    - technical_setup
    - training_schedule
    - success_metrics_definition
    - escalation_paths
    
  month_1:
    - usage_review
    - feedback_collection
    - optimization_recommendations
    - expansion_opportunities
```

### Support Structure
```python
support_coverage = {
    "24/7": {
        "tier_1": "Global support centers",
        "languages": ["English", "Spanish", "Mandarin"],
        "channels": ["Email", "Chat", "Phone"]
    },
    
    "regional": {
        "americas": "Miami support center",
        "europe": "Dublin support center",
        "asia": "Singapore support center"
    },
    
    "escalation": {
        "technical": "Follow the sun model",
        "commercial": "Regional managers",
        "executive": "Global account team"
    }
}
```

## Legal и Compliance

### International Contracts
```yaml
contract_considerations:
  jurisdiction:
    - governing_law
    - dispute_resolution
    - arbitration_clauses
    
  terms:
    - payment_currency
    - tax_responsibilities
    - ip_protection
    - termination_clauses
    
  compliance:
    - export_controls
    - data_residency
    - local_regulations
    - anti_corruption
```

### Data Privacy Regulations
```yaml
privacy_requirements:
  gdpr:
    regions: ["EU", "UK"]
    requirements: ["Consent", "Data portability", "Right to deletion"]
    
  ccpa:
    regions: ["California, USA"]
    requirements: ["Opt-out", "Data disclosure", "Non-discrimination"]
    
  lgpd:
    regions: ["Brazil"]
    requirements: ["Consent", "Data protection officer", "Impact assessment"]
    
  pipeda:
    regions: ["Canada"]
    requirements: ["Consent", "Access rights", "Accuracy"]
```

## Маркетинг для международных рынков

### Content Adaptation
```yaml
content_localization:
  website:
    - hreflang_tags
    - local_domains
    - cdn_optimization
    - local_testimonials
    
  marketing:
    - case_studies_local
    - cultural_imagery
    - local_events
    - regional_partnerships
    
  seo:
    - local_keywords
    - regional_search_engines
    - local_backlinks
    - cultural_context
```

## Метрики успеха

### KPIs для международного бизнеса
```python
international_kpis = {
    "revenue_metrics": {
        "arr_by_region": "Annual recurring revenue per region",
        "growth_rate": "YoY growth by market",
        "market_penetration": "Market share by country",
        "currency_impact": "FX gain/loss"
    },
    
    "customer_metrics": {
        "cac_by_region": "Customer acquisition cost",
        "ltv_by_region": "Lifetime value",
        "churn_by_market": "Market-specific churn",
        "nps_by_culture": "Cultural NPS variations"
    },
    
    "operational_metrics": {
        "time_to_close": "Sales cycle by region",
        "support_satisfaction": "CSAT by language",
        "partner_performance": "Partner contribution",
        "localization_roi": "Impact of localization"
    }
}
```

## Best Practices

1. **Cultural Intelligence** - понимание и уважение культурных различий
2. **Local Presence** - локальное присутствие через партнеров или офисы
3. **Flexible Approach** - адаптация стратегии под каждый рынок
4. **Relationship Building** - инвестиции в долгосрочные отношения
5. **Continuous Learning** - постоянное изучение новых рынков