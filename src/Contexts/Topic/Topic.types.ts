/** Data to create a topic via advanced flow */

export interface AdvancedTopic {
  /** unique identifier for a topic within the cluster */
  name: string;
  /** ordered list of messages that make up a topic */
  numPartitions: string;
  /** each topic can be replicated onto multiple brokers to improve availability */
  replicationFactor?: string;
  /** determines the reliability guarantee achievable for this topic */
  'min.insync.replicas'?: string;
  /** the length of time that messages are retained before they are deleted */
  'retention.ms'?: string;
  /** unit for retention time */
  'retention.ms.unit'?: string;
  /** the maximum record batch size */
  'max.message.bytes'?: string;
  /** unit for maximum message size */
  'max.message.bytes.unit'?: string;
  /** determines creation of timestamp in message */
  'message.timestamp.type'?: string;
  /** max timestamp difference of message leaving the producer and arriving at the broker */
  'message.timestamp.difference.max.ms'?: string;
  /** unit for message timestamp difference */
  'message.timestamp.difference.max.ms.unit'?: string;
  /** determines the final compression for the topic */
  'compression.type'?: string;
  /** The message format version the broker will use to append messages to the logs */
  'log.message.format.version'?: string;
  /** determines what happens to log segments beyond the retention window */
  'log.cleanup.policy'?: string;
  /** maximum total size of a partition's log segments before old log segments are deleted */
  'log.retention.bytes'?: string;
  /** unit for retention bytes */
  'log.retention.bytes.unit'?: string;
  /** size of the log segment files */
  'log.segment.bytes'?: string;
  /** unit for segment size */
  'log.segment.bytes.unit'?: string;
  /** allow a replica which is not in-sync to become the leader */
  'unclean.leader.election.enable'?: string;
  /** list of the replicas for which replication should be throttled on the follower side */
  'follower.replication.throttled.replicas'?: string;
  /** list of the replicas for which replication should be throttled on the leader side */
  'leader.replication.throttled.replicas'?: string;
  /** determines the time for which tombstone markers are retained */
  'delete.retention.ms'?: string;
  /** unit for delete retention time */
  'delete.retention.ms.unit'?: string;
  /** determines the frequency of compacting log in terms of the ratio of duplicated keys allowed */
  'min.cleanable.dirty.ratio'?: string;
  /** minimum time a message will remain uncompacted */
  'min.compaction.lag.ms'?: string;
  /** unit for minimum ratio */
  'min.compaction.lag.ms.unit'?: string;
  /** period of time after which the current log segment is rolled even if it is not full */
  'segment.ms'?: string;
  /** unit for segment time */
  'segment.ms.unit'?: string;
  /** a random delay to add to log segment to prevent bursts of log segment rolling activity */
  'segment.jitter.ms'?: string;
  /** unit for jitter time */
  'segment.jitter.ms.unit'?: string;
  /** delay before deleting a file from the filesystem */
  'file.delete.delay.ms'?: string;
  /** unit for delete delay */
  'file.delete.delay.ms.unit'?: string;
  /** determines whether to preallocate log segment files */
  preallocate?: string;
  /** the granularity of the offset index */
  'index.interval.bytes'?: string;
  /** unit for index interval size */
  'index.interval.bytes.unit'?: string;
  /** size of the index that maps offsets to file positions */
  'segment.index.bytes'?: string;
  /** unit for segment index size */
  'segment.index.bytes.unit'?: string;
  /** determines the number of messages between flushing data to the log */
  'flush.messages'?: string;
  /** unit for flush interval messages */
  'flush.messages.unit'?: string;
  /** determines the interval in time between flushing data to the log */
  'flush.ms'?: string;
  /** unit for flush interval time */
  'flush.ms.unit'?: string;
}

export interface TopicContextProp {
  /** Topic context store object */
  store: AdvancedTopic;
  /** Method to update store data */
  updateStore: (name: string, value: string | boolean | number) => void;
  updateBulkStore: (advanceConfig: AdvancedTopic) => void;
}

export interface ITopicProviderProps {
  /** children passed onto the topic provider */
  children: React.ReactNode;
}
