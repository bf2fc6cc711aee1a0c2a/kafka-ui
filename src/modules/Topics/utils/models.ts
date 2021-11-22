export type NewTopic = {
  /** unique identifier for a topic within the cluster */
  name: string;
  /** ordered list of messages that make up a topic */
  numPartitions: string;
  /** number of replicas for a Kafka topic */
  replicationFactor?: string;
  /** the length of time that messages are retained before they are deleted */
  'retention.ms'?: string;
  /** unit for retention time */
  'retention.ms.unit'?: string;
  /** maximum total size of a partition's log segments before old log segments are deleted */
  'retention.bytes'?: string;
  /** unit for retention bytes */
  'retention.bytes.unit'?: string;
  /** determines whether messages that reach the retention window are deleted or compacted */
  'cleanup.policy'?: string;
};

export type IAdvancedTopic = NewTopic & {
  selectedRetentionTimeOption?: string;
  selectedRetentionSizeOption?: string;
};
