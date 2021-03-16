import React, { createContext, useState } from 'react';
import {
  AdvancedTopic,
  ITopicProviderProps,
  TopicContextProp,
} from './Topic.types';

export const initialState: AdvancedTopic = {
  name: '',
  numPartitions: '',
  replicationFactor: '',
  'min.insync.replicas': '',
  'retention.ms': '',
  'retention.ms.unit': 'days',
  'max.message.bytes': '',
  'max.message.bytes.unit': 'bytes',
  'message.timestamp.type': 'CreateTime',
  'message.timestamp.difference.max.ms': '',
  'message.timestamp.difference.max.ms.unit': 'milliseconds',
  'compression.type': '',
  'log.cleanup.policy': '',
  'log.retention.bytes': '',
  'log.retention.bytes.unit': 'bytes',
  'log.segment.bytes': '',
  'log.segment.bytes.unit': 'bytes',
  'unclean.leader.election.enable': '',
  'follower.replication.throttled.replicas': '',
  'leader.replication.throttled.replicas': '',
  'delete.retention.ms': '',
  'delete.retention.ms.unit': 'milliseconds',
  'min.cleanable.dirty.ratio': '',
  'min.compaction.lag.ms': '',
  'min.compaction.lag.ms.unit': 'milliseconds',
  'segment.ms': '',
  'segment.ms.unit': 'milliseconds',
  'segment.jitter.ms': '',
  'segment.jitter.ms.unit': 'milliseconds',
  'file.delete.delay.ms': '',
  'file.delete.delay.ms.unit': 'milliseconds',
  preallocate: '',
  'index.interval.bytes': '',
  'index.interval.bytes.unit': 'bytes',
  'segment.index.bytes': '',
  'segment.index.bytes.unit': 'bytes',
  'flush.messages': '',
  'flush.messages.unit': 'milliseconds',
  'flush.ms': '',
  'flush.ms.unit': 'milliseconds',
};

export const TopicContext = createContext({} as TopicContextProp);

export const TopicContextProvider: React.FC<ITopicProviderProps> = ({
  children,
}) => {
  const [store, setStore] = useState<AdvancedTopic>(initialState);

  const updateStore = (name: string, value: string | boolean | number) => {
    setStore({
      ...store,
      [name]: value.toString(),
    });
  };

  const updateBulkStore = (advanceConfig: AdvancedTopic) => {
    setStore({
      ...store,
      ...advanceConfig,
    });
  };

  return (
    <TopicContext.Provider value={{ store, updateStore, updateBulkStore }}>
      {children}
    </TopicContext.Provider>
  );
};
