//TODO: Remove this once we move to modules and we can just import this from the openapi module.
export interface ConfigEntry {
    /**
     * The key indicating what configuration entry you would like to set for the topic.
     * @type {string}
     * @memberof ConfigEntry
     */
    key?: string;
    /**
     * Value to indicate the setting on the topic configuration entry.
     * @type {string}
     * @memberof ConfigEntry
     */
    value?: string;
  }
  /**
   * Input object to create a new topic.
   * @export
   * @interface NewTopicInput
   */
  export interface NewTopicInput {
    /**
     * The topic name, this value must be unique.
     * @type {string}
     * @memberof NewTopicInput
     */
    name: string;
    /**
     * 
     * @type {TopicSettings}
     * @memberof NewTopicInput
     */
    settings?: TopicSettings;
  }
  /**
   * Kafka topic partition
   * @export
   * @interface Partition
   */
  export interface Partition {
    /**
     * Uniquie id for the partition
     * @type {number}
     * @memberof Partition
     */
    id: number;
    /**
     * List of replicas for the partition
     * @type {Array<object>}
     * @memberof Partition
     */
    replicas?: Array<object>;
    /**
     * List isync-replicas for this partition.
     * @type {Array<object>}
     * @memberof Partition
     */
    isr?: Array<object>;
    /**
     * Kafka server / broker.
     * @type {object}
     * @memberof Partition
     */
    leader?: object;
  }
  /**
   * Kafka Topic (A feed where records are stored and published)
   * @export
   * @interface Topic
   */
  export interface Topic {
    /**
     * The name of the topic.
     * @type {string}
     * @memberof Topic
     */
    name?: string;
    /**
     * Topic configuration entry.
     * @type {Array<ConfigEntry>}
     * @memberof Topic
     */
    config?: Array<ConfigEntry>;
    /**
     * Partitions for this topic.
     * @type {Array<Partition>}
     * @memberof Topic
     */
    partitions?: Array<Partition>;
  }
  /**
   * Kafka Topic (A feed where records are stored and published)
   * @export
   * @interface TopicSettings
   */
  export interface TopicSettings {
    /**
     * Number of partitions for this topic.
     * @type {number}
     * @memberof TopicSettings
     */
    numPartitions?: number;
    /**
     * Number of replications for the topic.
     * @type {number}
     * @memberof TopicSettings
     */
    replicationFactor?: number;
    /**
     * Topic configuration entry.
     * @type {Array<ConfigEntry>}
     * @memberof TopicSettings
     */
    config?: Array<ConfigEntry>;
  }
  /**
   * A list of topics.
   * @export
   * @interface TopicsList
   */
  export interface TopicsList {
    /**
     * List of topics
     * @type {Array<Topic>}
     * @memberof TopicsList
     */
    topics: Array<Topic>;
    /**
     * The page offset
     * @type {number}
     * @memberof TopicsList
     */
    offset: number;
    /**
     * number of entries per page
     * @type {number}
     * @memberof TopicsList
     */
    limit: number;
    /**
     * Total number of topics
     * @type {number}
     * @memberof TopicsList
     */
    count: number;
  }