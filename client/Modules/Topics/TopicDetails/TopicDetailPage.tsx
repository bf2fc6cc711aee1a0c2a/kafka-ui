import React, { useContext, useEffect, useState } from 'react';
import { TopicDetailHead } from 'Modules/Topics/TopicDetails/Components/TopicDetailHead';
import { TopicDetailView } from './Components/TopicDetailView';
import { AdvancedTopic } from 'Contexts/Topic';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import { useHistory, useParams } from 'react-router';
import { getTopicDetail } from 'Services';
import { ConfigContext } from 'Contexts';

export type TopicDetailRouteParams = {
  topicName: string;
};

// TODO: Remove this mock, fetch it from server.
const topic: AdvancedTopic = {
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

export const TopicDetailGroup: React.FC = () => {
  const [topicDetail, setTopicDetail] = useState<AdvancedTopic>(topic);
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
