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
  topicName: '',
  partitions: 12,
  replicas: 0,
  minInSyncReplicas: 1,
  retentionTime: 1,
  retentionTimeUnit: 'day',
  maxMessageSize: 1,
  messageSizeUnit: 'bytes',
  timestampType: 'CreateTime',
  maxTimestampDiff: 0,
  timestampDiffUnit: 'millisecond',
  compressionType: 'Producer',
  cleanupPolicy: 'delete',
  retentionBytes: -1,
  retentionUnit: 'bytes',
  segmentSize: 10737441824,
  segmentUnit: 'bytes',
  uncleanLeaderElection: false,
  followerReplicas: '',
  leaderReplicas: '',
  deleteRetentionTime: 0,
  deleteRetentionUnit: 'millisecond',
  minRatio: 124,
  minLagTime: 0,
  minLagUnit: 'millisecond',
  segmentTime: 0,
  segmentTimeUnit: 'millisecond',
  jitterTime: 0,
  jitterTimeUnit: 'millisecond',
  deleteDelay: 0,
  deleteDelayUnit: 'millisecond',
  logPreallocation: false,
  indexIntervalSize: 4096,
  indexIntervalUnit: 'bytes',
  segmentIndexSize: 1048,
  segmentIndexUnit: 'bytes',
  intervalMessages: 9824,
  intervalMessagesUnit: 'millisecond',
  intervalTime: 9248,
  intervalTimeUnit: 'millisecond',
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
