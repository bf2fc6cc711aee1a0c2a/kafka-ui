/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

/** Data to create a topic via advanced flow */
export interface AdvancedTopic {
  /** unique identifier for a topic within the cluster */
  topicName: string;
  /** ordered list of messages that make up a topic */
  partitions: number;
  /** each topic can be replicated onto multiple brokers to improve availability */
  replicas: number;
  /** determines the reliability guarantee achievable for this topic */
  minInSyncReplicas: number;
  /** the length of time that messages are retained before they are deleted */
  retentionTime: number;
  /** unit for retention time */
  retentionTimeUnit: string;
  /** the maximum record batch size */
  maxMessageSize: number;
  /** unit for maximum message size */
  messageSizeUnit: string;
  /** determines creation of timestamp in message */
  timestampType: string;
  /** max timestamp difference of message leaving the producer and arriving at the broker */
  maxTimestampDiff: number;
  /** unit for message timestamp difference */
  timestampDiffUnit: string;
  /** determines the final compression for the topic */
  compressionType: string;
  /** determines what happens to log segments beyond the retention window */
  cleanupPolicy: string;
  /** maximum total size of a partition's log segments before old log segments are deleted */
  retentionBytes: number;
  /** unit for retention bytes */
  retentionUnit: string;
  /** size of the log segment files */
  segmentSize: number;
  /** unit for segment size */
  segmentUnit: string;
  /** allow a replica which is not in-sync to become the leader */
  uncleanLeaderElection: boolean;
  /** list of the replicas for which replication should be throttled on the follower side */
  followerReplicas: string;
  /** list of the replicas for which replication should be throttled on the leader side */
  leaderReplicas: string;
  /** determines the time for which tombstone markers are retained */
  deleteRetentionTime: number;
  /** unit for delete retention time */
  deleteRetentionUnit: string;
  /** determines the frequency of compacting log in terms of the ratio of duplicated keys allowed */
  minRatio: number;
  /** minimum time a message will remain uncompacted */
  minLagTime: number;
  /** unit for minimum ratio */
  minLagUnit: string;
  /** period of time after which the current log segment is rolled even if it is not full */
  segmentTime: number;
  /** unit for segment time */
  segmentTimeUnit: string;
  /** a random delay to add to log segment to prevent bursts of log segment rolling activity */
  jitterTime: number;
  /** unit for jitter time */
  jitterTimeUnit: string;
  /** delay before deleting a file from the filesystem */
  deleteDelay: number;
  /** unit for delete delay */
  deleteDelayUnit: string;
  /** determines whether to preallocate log segment files */
  logPreallocation: boolean;
  /** the granularity of the offset index */
  indexIntervalSize: number;
  /** unit for index interval size */
  indexIntervalUnit: string;
  /** size of the index that maps offsets to file positions */
  segmentIndexSize: number;
  /** unit for segment index size */
  segmentIndexUnit: string;
  /** determines the number of messages between flushing data to the log */
  intervalMessages: number;
  /** unit for flush interval messages */
  intervalMessagesUnit: string;
  /** determines the interval in time between flushing data to the log */
  intervalTime: number;
  /** unit for flush interval time */
  intervalTimeUnit: string;
}

export interface AdvancedTopic2 {
  /** unique identifier for a topic within the cluster */
  name: string;
  /** ordered list of messages that make up a topic */
  numPartitions: string;
  /** each topic can be replicated onto multiple brokers to improve availability */
  replicationFactor: string;
  /** determines the reliability guarantee achievable for this topic */
  'min.insync.replicas'?: string;
  /** the length of time that messages are retained before they are deleted */
  'retention.ms'?: string;
  /** unit for retention time */
  retentionTimeUnit?: string;
  /** the maximum record batch size */
  'max.message.bytes'?: string;
  /** unit for maximum message size */
  messageSizeUnit?: string;
  /** determines creation of timestamp in message */
  'message.timestamp.type'?: string;
  /** max timestamp difference of message leaving the producer and arriving at the broker */
  'message.timestamp.difference.max.ms'?: string;
  /** unit for message timestamp difference */
  timestampDiffUnit?: string;
  /** determines the final compression for the topic */
  'compression.type'?: string;
  /** determines what happens to log segments beyond the retention window */
  'log.cleanup.policy'?: string;
  /** maximum total size of a partition's log segments before old log segments are deleted */
  'log.retention.bytes'?: string;
  /** unit for retention bytes */
  retentionUnit?: string;
  /** size of the log segment files */
  'log.segment.bytes'?: string;
  /** unit for segment size */
  segmentUnit?: string;
  /** allow a replica which is not in-sync to become the leader */
  'unclean.leader.election.enable'?: string;
  /** list of the replicas for which replication should be throttled on the follower side */
  'follower.replication.throttled.replicas'?: string;
  /** list of the replicas for which replication should be throttled on the leader side */
  'leader.replication.throttled.replicas'?: string;
  /** determines the time for which tombstone markers are retained */
  'delete.retention.ms'?: string;
  /** unit for delete retention time */
  deleteRetentionUnit?: string;
  /** determines the frequency of compacting log in terms of the ratio of duplicated keys allowed */
  'min.cleanable.dirty.ratio'?: string;
  /** minimum time a message will remain uncompacted */
  'min.compaction.lag.ms'?: string;
  /** unit for minimum ratio */
  minLagUnit?: string;
  /** period of time after which the current log segment is rolled even if it is not full */
  'segment.ms'?: string;
  /** unit for segment time */
  segmentTimeUnit?: string;
  /** a random delay to add to log segment to prevent bursts of log segment rolling activity */
  'segment.jitter.ms'?: string;
  /** unit for jitter time */
  jitterTimeUnit?: string;
  /** delay before deleting a file from the filesystem */
  'file.delete.delay.ms'?: string;
  /** unit for delete delay */
  deleteDelayUnit?: string;
  /** determines whether to preallocate log segment files */
  preallocate?: string;
  /** the granularity of the offset index */
  'index.interval.bytes'?: string;
  /** unit for index interval size */
  indexIntervalUnit?: string;
  /** size of the index that maps offsets to file positions */
  'segment.index.bytes'?: string;
  /** unit for segment index size */
  segmentIndexUnit?: string;
  /** determines the number of messages between flushing data to the log */
  'flush.messages'?: string;
  /** unit for flush interval messages */
  intervalMessagesUnit?: string;
  /** determines the interval in time between flushing data to the log */
  'flush.ms'?: string;
  /** unit for flush interval time */
  intervalTimeUnit?: string;
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
