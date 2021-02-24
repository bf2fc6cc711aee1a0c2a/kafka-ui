/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useContext, useEffect, useState } from 'react';
import { TopicDetailHead } from 'Elements/Components/TopicDetailView/TopicDetailHead.patternfly';
import { TopicDetailView } from 'Elements/Components/TopicDetailView/TopicDetailView.patternfly';
import { AdvancedTopic2 } from 'Contexts/Topic';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import { useHistory, useParams } from 'react-router';
import { getTopicDetail } from 'Services';
import { ConfigContext } from 'Contexts';

export type TopicDetailRouteParams = {
  topicName: string;
};

// TODO: Remove this mock, fetch it from server.
const topic: AdvancedTopic2 = {
  name: 'SampleTopic2345',
  numPartitions: '52',
  replicationFactor: '35',
  'min.insync.replicas': '78',
  'retention.ms': '78',
  retentionTimeUnit: 'days',
  'max.message.bytes': '50',
  messageSizeUnit: 'bytes',
  'message.timestamp.type': 'CreateTime',
  'message.timestamp.difference.max.ms': '4',
  timestampDiffUnit: 'milliseconds',
  'compression.type': 'Producer',
  'log.cleanup.policy': 'Delete',
  'log.retention.bytes': '-1',
  retentionUnit: 'byte',
  'log.segment.bytes': '78',
  segmentUnit: 'bytes',
  'unclean.leader.election.enable': 'false',
  'follower.replication.throttled.replicas': '',
  'leader.replication.throttled.replicas': '',
  'delete.retention.ms': '789',
  deleteRetentionUnit: 'milliseconds',
  'min.cleanable.dirty.ratio': '4',
  'min.compaction.lag.ms': '58',
  minLagUnit: 'milliseconds',
  'segment.ms': '6048000',
  segmentTimeUnit: 'milliseconds',
  'segment.jitter.ms': '0',
  jitterTimeUnit: 'milliseconds',
  'file.delete.delay.ms': '6000',
  deleteDelayUnit: 'milliseconds',
  preallocate: 'true',
  'index.interval.bytes': '4096',
  indexIntervalUnit: 'bytes',
  'segment.index.bytes': '10847560',
  segmentIndexUnit: 'bytes',
  'flush.messages': '783945',
  intervalMessagesUnit: 'milliseconds',
  'flush.ms': '3894949',
  intervalTimeUnit: 'milliseconds',
};

export const TopicDetailGroup: React.FC = () => {
  const [topicDetail, setTopicDetail] = useState<AdvancedTopic2>(topic);
  const { topicName } = useParams<TopicDetailRouteParams>();
  const history = useHistory();
  const config = useContext(ConfigContext);

  const fetchTopicDetail = async (topicName: string) => {
    const response = await getTopicDetail(topicName, config);
    setTopicDetail(response);
  };

  // Make the get request
  useEffect(() => {
    fetchTopicDetail(topicName);
  }, [topicName]);

  const updateTopic = () => {
    history.push(`/topics/update/${topicName}`);
  };

  return (
    <>
      <TopicDetailHead topicName={topicName} />
      <Tabs
        activeKey={1}
        onSelect={() => {
          return;
        }}
        isBox={false}
        className='tab-padding'
      >
        <Tab eventKey={0} title={<TabTitleText>Consumer Groups</TabTitleText>}>
          Consumer Group Component
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Properties</TabTitleText>}>
          <TopicDetailView
            topic={topicDetail}
            deleteTopic={() => {
              return;
            }}
            updateTopic={updateTopic}
          />
        </Tab>
      </Tabs>
    </>
  );
};
