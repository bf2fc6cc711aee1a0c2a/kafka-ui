/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { createContext, useState } from 'react';
import {
  AdvancedTopic,
  ITopicProviderProps,
  TopicContextProp,
} from './Topic.types';

const initialState: AdvancedTopic = {
  name: 'SampleTopic2345',
  numPartitions: '52',
  replicationFactor: '35',
  'min.insync.replicas': '78',
  'retention.ms': '78',
  'retention.ms.unit': 'days',
  'max.message.bytes': '50',
  'max.message.bytes.unit': 'bytes',
  'message.timestamp.type': 'CreateTime',
  'message.timestamp.difference.max.ms': '4',
  'message.timestamp.difference.max.ms.unit': 'milliseconds',
  'compression.type': 'Producer',
  'log.cleanup.policy': 'Delete',
  'log.retention.bytes': '-1',
  'log.retention.bytes.unit': 'bytes',
  'log.segment.bytes': '78',
  'log.segment.bytes.unit': 'bytes',
  'unclean.leader.election.enable': 'false',
  'follower.replication.throttled.replicas': '',
  'leader.replication.throttled.replicas': '',
  'delete.retention.ms': '789',
  'delete.retention.ms.unit': 'milliseconds',
  'min.cleanable.dirty.ratio': '4',
  'min.compaction.lag.ms': '58',
  'min.compaction.lag.ms.unit': 'milliseconds',
  'segment.ms': '6048000',
  'segment.ms.unit': 'milliseconds',
  'segment.jitter.ms': '0',
  'segment.jitter.ms.unit': 'milliseconds',
  'file.delete.delay.ms': '6000',
  'file.delete.delay.ms.unit': 'milliseconds',
  preallocate: 'true',
  'index.interval.bytes': '4096',
  'index.interval.bytes.unit': 'bytes',
  'segment.index.bytes': '10847560',
  'segment.index.bytes.unit': 'bytes',
  'flush.messages': '783945',
  'flush.messages.unit': 'milliseconds',
  'flush.ms': '3894949',
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
      [name]: value,
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
