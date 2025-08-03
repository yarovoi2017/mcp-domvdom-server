# Правила для Специалиста по BigData

## Роль и ответственность
Специалист по BigData отвечает за проектирование, разработку и оптимизацию систем обработки больших данных, создание data pipelines, аналитику и машинное обучение на больших объемах данных.

## Технологический стек

### Storage Systems
- **HDFS** - Hadoop Distributed File System
- **Amazon S3** - Object storage
- **Apache Cassandra** - Wide column store
- **MongoDB** - Document database
- **ClickHouse** - Column-oriented DBMS

### Processing Frameworks
- **Apache Spark** - Unified analytics engine
- **Apache Flink** - Stream processing
- **Apache Beam** - Unified programming model
- **Presto/Trino** - Distributed SQL engine
- **Apache Drill** - Schema-free SQL

### Message Queues
- **Apache Kafka** - Distributed streaming
- **Apache Pulsar** - Multi-tenant messaging
- **RabbitMQ** - Message broker
- **Amazon Kinesis** - Real-time streaming
- **Redis Streams** - In-memory streams

## Data Architecture

### Lambda Architecture
```yaml
layers:
  batch_layer:
    - storage: "HDFS/S3"
    - processing: "Spark/MapReduce"
    - serving: "HBase/Cassandra"
    
  speed_layer:
    - ingestion: "Kafka"
    - processing: "Spark Streaming/Flink"
    - serving: "Redis/Druid"
    
  serving_layer:
    - query: "Presto/Impala"
    - api: "REST/GraphQL"
    - cache: "Redis/Memcached"
```

### Data Pipeline Design
```python
# PySpark pipeline example
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *

class DataPipeline:
    def __init__(self, app_name="BigDataPipeline"):
        self.spark = SparkSession.builder \
            .appName(app_name) \
            .config("spark.sql.adaptive.enabled", "true") \
            .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
            .getOrCreate()
    
    def extract(self, source_path):
        """Extract data from source"""
        return self.spark.read \
            .option("header", "true") \
            .option("inferSchema", "true") \
            .parquet(source_path)
    
    def transform(self, df):
        """Apply transformations"""
        return df \
            .filter(col("timestamp") >= date_sub(current_date(), 30)) \
            .groupBy("user_id", "product_category") \
            .agg(
                count("*").alias("transaction_count"),
                sum("amount").alias("total_amount"),
                avg("amount").alias("avg_amount")
            ) \
            .withColumn("segment", 
                when(col("total_amount") > 1000, "high_value")
                .when(col("total_amount") > 500, "medium_value")
                .otherwise("low_value")
            )
    
    def load(self, df, target_path):
        """Load data to target"""
        df.write \
            .mode("overwrite") \
            .partitionBy("segment") \
            .parquet(target_path)
```

## Stream Processing

### Kafka Streams Implementation
```java
// Kafka Streams processing
public class StreamProcessor {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "stream-processor");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        
        StreamsBuilder builder = new StreamsBuilder();
        
        KStream<String, Transaction> transactions = builder
            .stream("transactions", Consumed.with(Serdes.String(), transactionSerde));
        
        KTable<Windowed<String>, Long> aggregated = transactions
            .filter((k, v) -> v.getAmount() > 100)
            .groupBy((k, v) -> v.getUserId())
            .windowedBy(TimeWindows.of(Duration.ofMinutes(5)))
            .count();
        
        aggregated.toStream()
            .map((k, v) -> new KeyValue<>(k.key(), v))
            .to("aggregated-output", Produced.with(Serdes.String(), Serdes.Long()));
        
        KafkaStreams streams = new KafkaStreams(builder.build(), props);
        streams.start();
    }
}
```

### Flink Real-time Processing
```scala
// Apache Flink streaming
object RealtimeAnalytics {
  def main(args: Array[String]): Unit = {
    val env = StreamExecutionEnvironment.getExecutionEnvironment
    
    val stream = env
      .addSource(new FlinkKafkaConsumer[Event]("events", schema, properties))
      .keyBy(_.userId)
      .window(TumblingEventTimeWindows.of(Time.minutes(1)))
      .aggregate(new EventAggregator)
      .filter(_.count > 10)
      .addSink(new ElasticsearchSink[AggregatedEvent](esConfig))
    
    env.execute("Realtime Analytics")
  }
}
```

## Data Storage Optimization

### Partitioning Strategies
```sql
-- Optimal partitioning for time-series data
CREATE TABLE events (
    event_id BIGINT,
    user_id INT,
    event_type VARCHAR(50),
    event_time TIMESTAMP,
    properties JSON
) 
PARTITION BY RANGE (DATE(event_time)) (
    PARTITION p202401 VALUES LESS THAN ('2024-02-01'),
    PARTITION p202402 VALUES LESS THAN ('2024-03-01'),
    PARTITION p202403 VALUES LESS THAN ('2024-04-01')
);

-- Bucketing for even distribution
CREATE TABLE user_transactions
CLUSTERED BY (user_id) 
SORTED BY (transaction_date DESC) 
INTO 256 BUCKETS;
```

### Compression Techniques
```yaml
compression_options:
  parquet:
    compression: "snappy"  # Fast compression
    encoding: "delta"      # For numeric columns
    dictionary: true       # For string columns
    
  orc:
    compression: "zlib"    # Better compression ratio
    stripe_size: 64MB
    compression_strategy: "speed"
    
  avro:
    compression: "deflate"
    compression_level: 6
```

## Performance Optimization

### Spark Optimization
```python
# Optimization techniques
class SparkOptimizer:
    @staticmethod
    def optimize_joins(df1, df2, join_key):
        """Optimize join operations"""
        # Broadcast join for small tables
        if df2.count() < 10000000:  # 10M records
            return df1.join(broadcast(df2), join_key)
        
        # Sort-merge join for large tables
        return df1.repartition(join_key).join(
            df2.repartition(join_key), 
            join_key
        )
    
    @staticmethod
    def optimize_aggregations(df):
        """Optimize aggregation operations"""
        return df \
            .repartition("group_key") \
            .sortWithinPartitions("group_key") \
            .groupBy("group_key") \
            .agg(
                collect_list("values").alias("all_values"),
                approx_count_distinct("user_id").alias("unique_users")
            )
    
    @staticmethod
    def cache_strategy(df):
        """Implement caching strategy"""
        if df.count() < 1000000:  # Small dataset
            return df.cache()
        else:  # Large dataset
            return df.persist(StorageLevel.MEMORY_AND_DISK_SER)
```

### Query Optimization
```sql
-- Optimized query with proper indexing
WITH user_metrics AS (
    SELECT 
        user_id,
        COUNT(DISTINCT session_id) as session_count,
        SUM(revenue) as total_revenue,
        MAX(last_activity) as last_seen
    FROM events
    WHERE date >= CURRENT_DATE - INTERVAL '30' DAY
    GROUP BY user_id
),
user_segments AS (
    SELECT 
        user_id,
        CASE 
            WHEN total_revenue > 1000 THEN 'high_value'
            WHEN total_revenue > 100 THEN 'medium_value'
            ELSE 'low_value'
        END as segment
    FROM user_metrics
)
SELECT 
    segment,
    COUNT(*) as user_count,
    AVG(session_count) as avg_sessions
FROM user_segments
GROUP BY segment;
```

## Data Quality

### Quality Checks
```python
class DataQualityChecker:
    def __init__(self, spark):
        self.spark = spark
        
    def check_completeness(self, df, required_columns):
        """Check for null values in required columns"""
        null_counts = {}
        for col in required_columns:
            null_count = df.filter(df[col].isNull()).count()
            null_counts[col] = null_count
        return null_counts
    
    def check_uniqueness(self, df, unique_columns):
        """Check for duplicate values"""
        duplicate_count = df.groupBy(unique_columns) \
            .count() \
            .filter("count > 1") \
            .count()
        return duplicate_count
    
    def check_validity(self, df, validation_rules):
        """Apply validation rules"""
        results = {}
        for rule_name, rule_expr in validation_rules.items():
            invalid_count = df.filter(~rule_expr).count()
            results[rule_name] = invalid_count
        return results
```

## Machine Learning at Scale

### MLlib Implementation
```python
from pyspark.ml import Pipeline
from pyspark.ml.feature import VectorAssembler, StandardScaler
from pyspark.ml.classification import RandomForestClassifier
from pyspark.ml.evaluation import BinaryClassificationEvaluator

# Feature engineering pipeline
def create_ml_pipeline(feature_cols):
    # Assemble features
    assembler = VectorAssembler(
        inputCols=feature_cols,
        outputCol="features"
    )
    
    # Scale features
    scaler = StandardScaler(
        inputCol="features",
        outputCol="scaled_features"
    )
    
    # Train model
    rf = RandomForestClassifier(
        featuresCol="scaled_features",
        labelCol="label",
        numTrees=100,
        maxDepth=10
    )
    
    # Create pipeline
    pipeline = Pipeline(stages=[assembler, scaler, rf])
    
    return pipeline
```

## Monitoring and Alerting

### Metrics Collection
```yaml
monitoring:
  infrastructure:
    - cpu_usage
    - memory_usage
    - disk_io
    - network_throughput
    
  application:
    - job_duration
    - records_processed
    - error_rate
    - data_lag
    
  data_quality:
    - null_percentage
    - duplicate_count
    - schema_violations
    - outlier_detection
```

### Alert Configuration
```python
class AlertManager:
    def __init__(self, config):
        self.thresholds = config['thresholds']
        self.channels = config['notification_channels']
    
    def check_metrics(self, metrics):
        alerts = []
        
        # Check data freshness
        if metrics['data_lag'] > self.thresholds['max_lag_minutes']:
            alerts.append({
                'severity': 'critical',
                'message': f"Data lag exceeds {self.thresholds['max_lag_minutes']} minutes",
                'metric': 'data_lag',
                'value': metrics['data_lag']
            })
        
        # Check processing time
        if metrics['job_duration'] > self.thresholds['max_job_duration']:
            alerts.append({
                'severity': 'warning',
                'message': f"Job duration exceeds threshold",
                'metric': 'job_duration',
                'value': metrics['job_duration']
            })
        
        return alerts
```

## Security and Compliance

### Data Encryption
```yaml
encryption:
  at_rest:
    - hdfs: "AES-256"
    - s3: "SSE-S3"
    - database: "TDE"
    
  in_transit:
    - ssl/tls: "TLS 1.3"
    - vpn: "IPSec"
    - kerberos: "enabled"
```

### Access Control
```python
# Role-based access control
access_policies = {
    "data_scientist": {
        "read": ["raw_data", "processed_data", "ml_models"],
        "write": ["sandbox", "ml_experiments"],
        "execute": ["spark_jobs", "ml_training"]
    },
    "data_engineer": {
        "read": ["*"],
        "write": ["*"],
        "execute": ["*"]
    },
    "analyst": {
        "read": ["processed_data", "reports"],
        "write": ["reports"],
        "execute": ["sql_queries"]
    }
}
```

## Cost Optimization

### Resource Management
```yaml
optimization_strategies:
  compute:
    - spot_instances: "Use for non-critical workloads"
    - auto_scaling: "Scale based on workload"
    - resource_tagging: "Track costs by project"
    
  storage:
    - lifecycle_policies: "Archive old data"
    - compression: "Use appropriate compression"
    - deduplication: "Remove duplicate data"
    
  network:
    - data_locality: "Process data where it's stored"
    - caching: "Cache frequently accessed data"
    - cdn: "Use CDN for distributed access"
```

## Best Practices

1. **Design for Scale** - архитектура должна масштабироваться
2. **Data Governance** - четкие правила управления данными
3. **Monitor Everything** - комплексный мониторинг
4. **Automate Operations** - автоматизация рутинных задач
5. **Security First** - безопасность на всех уровнях