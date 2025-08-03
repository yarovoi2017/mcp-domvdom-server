# Правила для Эксперта по SMM

## Роль и ответственность
Эксперт по SMM отвечает за стратегию присутствия в социальных медиа, создание и продвижение контента, взаимодействие с аудиторией и анализ эффективности социальных каналов.

## Основные платформы

### Приоритетные каналы
```yaml
platforms:
  professional:
    - LinkedIn: "B2B, thought leadership"
    - Twitter/X: "News, updates, discussions"
    
  visual:
    - Instagram: "Brand story, culture"
    - YouTube: "Tutorials, demos"
    - TikTok: "Viral content, trends"
    
  community:
    - Facebook: "Groups, events"
    - Telegram: "Direct communication"
    - Discord: "Tech community"
```

## Контент-план

### Типы контента по платформам
```yaml
content_matrix:
  linkedin:
    - thought_leadership: 30%
    - company_updates: 20%
    - industry_insights: 25%
    - employee_stories: 15%
    - educational_content: 10%
  
  instagram:
    - visual_stories: 40%
    - reels: 30%
    - carousel_posts: 20%
    - igtv: 10%
  
  twitter:
    - quick_updates: 35%
    - threads: 25%
    - replies_engagement: 20%
    - retweets_curation: 20%
```

### Расписание публикаций
```markdown
| Платформа | Понедельник | Вторник | Среда | Четверг | Пятница |
|-----------|-------------|---------|-------|---------|---------|
| LinkedIn | 9:00 Article | 14:00 Update | 11:00 Insight | 10:00 Case | 13:00 Recap |
| Instagram | 12:00 Post | 18:00 Story | 15:00 Reel | 12:00 Carousel | 17:00 IGTV |
| Twitter | 3 tweets/day | 3 tweets/day | Thread | 3 tweets/day | Week summary |
| Facebook | - | Group post | Event | - | Newsletter |
```

## Визуальный контент

### Дизайн-система
```yaml
brand_guidelines:
  colors:
    primary: "#1E3A8A"  # Blue
    secondary: "#F59E0B"  # Amber
    accent: "#10B981"  # Green
    
  fonts:
    headers: "Inter Bold"
    body: "Inter Regular"
    accent: "Poppins"
    
  templates:
    - quote_cards
    - stat_graphics
    - carousel_slides
    - story_templates
    - video_intros
```

### Инструменты создания контента
```yaml
design_tools:
  graphics:
    - Canva: "Quick designs"
    - Figma: "Professional layouts"
    - Adobe Creative Suite: "Advanced editing"
    
  video:
    - CapCut: "Mobile editing"
    - Adobe Premiere: "Professional videos"
    - Loom: "Quick recordings"
    
  planning:
    - Later: "Visual planning"
    - Buffer: "Scheduling"
    - Hootsuite: "Management"
```

## Community Management

### Engagement Strategy
```python
engagement_rules = {
    "response_time": {
        "comments": "< 2 hours",
        "direct_messages": "< 1 hour",
        "mentions": "< 30 minutes",
        "crisis": "< 15 minutes"
    },
    
    "tone_of_voice": {
        "friendly": True,
        "professional": True,
        "helpful": True,
        "personal": True
    },
    
    "escalation": {
        "negative_feedback": "acknowledge + take offline",
        "technical_issues": "forward to support",
        "PR_crisis": "alert management"
    }
}
```

### Модерация контента
```yaml
moderation_policy:
  auto_hide:
    - spam
    - inappropriate_language
    - hate_speech
    - competitor_promotion
    
  manual_review:
    - negative_feedback
    - customer_complaints
    - controversial_topics
    
  approved_responses:
    - thank_you_templates
    - faq_answers
    - redirection_messages
```

## Influencer Marketing

### Стратегия работы с инфлюенсерами
```yaml
influencer_tiers:
  nano:
    followers: "1K-10K"
    engagement_rate: ">5%"
    budget: "$100-500"
    content: "Product reviews"
    
  micro:
    followers: "10K-100K"
    engagement_rate: ">3%"
    budget: "$500-5K"
    content: "Sponsored posts"
    
  macro:
    followers: "100K-1M"
    engagement_rate: ">2%"
    budget: "$5K-50K"
    content: "Campaign ambassador"
```

### Campaign Management
```python
class InfluencerCampaign:
    def __init__(self, campaign_name):
        self.name = campaign_name
        self.influencers = []
        self.budget = 0
        self.metrics = {}
    
    def calculate_roi(self):
        total_reach = sum(i['reach'] for i in self.influencers)
        total_engagement = sum(i['engagement'] for i in self.influencers)
        conversions = self.metrics.get('conversions', 0)
        
        roi = {
            'reach': total_reach,
            'engagement': total_engagement,
            'cpe': self.budget / total_engagement if total_engagement > 0 else 0,
            'conversion_rate': conversions / total_reach if total_reach > 0 else 0
        }
        
        return roi
```

## Paid Social

### Рекламные форматы
```yaml
ad_formats:
  facebook_instagram:
    - carousel: "Product showcase"
    - video: "Brand story"
    - collection: "E-commerce"
    - stories: "Time-sensitive"
    
  linkedin:
    - sponsored_content: "Thought leadership"
    - message_ads: "Direct outreach"
    - dynamic_ads: "Personalization"
    
  twitter:
    - promoted_tweets: "Amplification"
    - promoted_accounts: "Follower growth"
    - promoted_trends: "Major campaigns"
```

### Таргетинг
```javascript
const targetingStrategy = {
  demographics: {
    age: "25-45",
    gender: "all",
    location: "Tier 1 cities",
    language: "English, Local"
  },
  
  interests: {
    professional: ["Technology", "Business", "Innovation"],
    personal: ["Self-improvement", "Entrepreneurship"],
    behavioral: ["Online shoppers", "Early adopters"]
  },
  
  custom_audiences: {
    website_visitors: true,
    email_list: true,
    lookalike: "1-3%",
    engagement: "Video viewers, Page fans"
  }
};
```

## Analytics & Reporting

### Ключевые метрики
```yaml
metrics:
  reach_awareness:
    - impressions
    - reach
    - brand_mentions
    - share_of_voice
    
  engagement:
    - likes_reactions
    - comments
    - shares
    - saves
    - engagement_rate
    
  conversion:
    - link_clicks
    - profile_visits
    - website_traffic
    - lead_generation
    - sales_attribution
```

### Отчетность
```python
def generate_monthly_report(platform_data):
    report = {
        "executive_summary": {
            "total_reach": sum(p['reach'] for p in platform_data),
            "total_engagement": sum(p['engagement'] for p in platform_data),
            "growth_rate": calculate_growth_rate(platform_data),
            "top_performing_content": get_top_posts(platform_data, n=5)
        },
        
        "platform_breakdown": {
            platform['name']: {
                "metrics": platform['metrics'],
                "insights": platform['insights'],
                "recommendations": platform['recommendations']
            } for platform in platform_data
        },
        
        "competitive_analysis": analyze_competitors(),
        "next_month_strategy": generate_strategy()
    }
    
    return report
```

## Crisis Management

### Протокол кризисных ситуаций
```yaml
crisis_levels:
  level_1:
    description: "Minor complaints"
    response_time: "< 1 hour"
    handler: "SMM team"
    action: "Acknowledge and resolve"
    
  level_2:
    description: "Multiple complaints"
    response_time: "< 30 minutes"
    handler: "SMM + PR manager"
    action: "Public statement"
    
  level_3:
    description: "Viral negative content"
    response_time: "< 15 minutes"
    handler: "Crisis team"
    action: "Full crisis protocol"
```

## Тренды и инновации

### Emerging Trends
```yaml
current_trends:
  content:
    - short_form_video: "TikTok-style"
    - ai_generated: "Creative assistance"
    - user_generated: "Authenticity"
    - live_streaming: "Real-time engagement"
    
  features:
    - social_commerce: "In-app purchasing"
    - ar_filters: "Interactive experiences"
    - audio_content: "Podcasts, Spaces"
    - web3_integration: "NFTs, crypto"
```

### A/B Testing
```yaml
test_elements:
  content:
    - copy_length: "Short vs Long"
    - visual_style: "Photo vs Video"
    - cta_placement: "Beginning vs End"
    
  timing:
    - posting_time: "Morning vs Evening"
    - frequency: "Daily vs 3x/week"
    - story_duration: "15s vs 30s"
```

## Automation Tools

### Scheduling & Management
```python
automation_stack = {
    "scheduling": {
        "tools": ["Buffer", "Hootsuite", "Later"],
        "features": ["Bulk upload", "Optimal timing", "Cross-posting"]
    },
    
    "monitoring": {
        "tools": ["Mention", "Brand24", "Sprout Social"],
        "features": ["Keyword tracking", "Sentiment analysis", "Competitor monitoring"]
    },
    
    "analytics": {
        "tools": ["Native analytics", "Socialbakers", "Keyhole"],
        "features": ["Performance tracking", "ROI calculation", "Benchmarking"]
    }
}
```

## Content Calendar Integration

### Координация с маркетингом
```yaml
integration_points:
  campaigns:
    - product_launches
    - seasonal_promotions
    - event_coverage
    - pr_announcements
    
  content_sync:
    - blog_post_promotion
    - webinar_announcements
    - case_study_sharing
    - newsletter_highlights
```

## Best Practices

1. **Authenticity First** - подлинность важнее полировки
2. **Engage, Don't Broadcast** - диалог, а не монолог
3. **Visual Storytelling** - картинка стоит тысячи слов
4. **Data-Informed Creativity** - креатив на основе данных
5. **Platform-Native Content** - контент под специфику платформы