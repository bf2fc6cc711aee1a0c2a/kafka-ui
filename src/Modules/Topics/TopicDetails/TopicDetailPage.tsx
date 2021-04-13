import React, { useContext, useEffect, useState } from 'react';
import { TopicDetailHead } from '../../../Modules/Topics/TopicDetails/Components/TopicDetailHead';
import { TopicDetailView } from './Components/TopicDetailView';
import { AdvancedTopic } from '../../../Contexts/Topic';
import {
  AlertVariant,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  TabTitleText,
} from '@patternfly/react-core';
import { getTopicDetail } from '../../../Services';
import { ConfigContext } from '../../../Contexts';
import { ConsumerGroupsList } from '../../ConsumerGroups/ConsumerGroupList/Components/ConsumerGroupList';
import { DeleteTopics } from '../TopicList/Components/DeleteTopicsModal';
import { isAxiosError } from '../../../Utils/axios';
import { AlertContext } from '../../../Contexts/Alert';
import { useHistory } from 'react-router';

export type TopicDetailGroupProps = {
  topicName: string;
  onUpdateTopic: () => void;
  getTopicListPath: () => string;
  onClickTopicList: () => void;
  onDeleteTopic: () => void;
  onError?: (errorCode: number, message: string) => void;
  eventKey: number;
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
  'cleanup.policy': 'Delete',
  'retention.bytes': '-1',
  'retention.bytes.unit': 'bytes',
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

export const TopicDetailGroup: React.FC<TopicDetailGroupProps> = ({
  topicName,
  onUpdateTopic,
  getTopicListPath,
  onClickTopicList,
  onDeleteTopic,
  onError,
  eventKey,
}) => {
  const [topicDetail, setTopicDetail] = useState<AdvancedTopic>(topic);
  const [activeTabKey, setActiveTabKey] = useState(eventKey);
  const config = useContext(ConfigContext);
  const [deleteModal, setDeleteModal] = useState(false);
  const { addAlert } = useContext(AlertContext);
  const history = useHistory();
  const fetchTopicDetail = async (topicName: string) => {
    if (eventKey === 2) {
      try {
        const response = await getTopicDetail(topicName, config);
        setTopicDetail(response);
      } catch (err) {
        if (isAxiosError(err)) {
          if (onError) {
            onError(err.response?.data.code, err.response?.data.error);
          }
          if (err.response?.status === 404) {
            // then it's a non-existent topic
            addAlert(`Topic ${topicName} does not exist`, AlertVariant.danger);
            onClickTopicList();
          }
        }
      }
    }
  };
  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  // Make the get request
  useEffect(() => {
    fetchTopicDetail(topicName);
  }, [topicName]);

  const deleteTopic = () => {
    setDeleteModal(true);
  };
  const onDeleteConsumer = () => {
    history.push('/consumerGroups');
  };

  return (
    <>
      <TopicDetailHead
        topicName={topicName}
        getTopicListPath={getTopicListPath}
        onClickTopicList={onClickTopicList}
      />
      <PageSection variant={PageSectionVariants.light}>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          isBox={false}
          className='tab-padding'
        >
          <Tab
            eventKey={1}
            title={<TabTitleText>Consumer Groups</TabTitleText>}
          >
            <ConsumerGroupsList
              onDeleteConsumerGroup={onDeleteConsumer}
              consumerGroupByTopic={true}
              topic={topicName}
            />
          </Tab>
          <Tab eventKey={2} title={<TabTitleText>Properties</TabTitleText>}>
            <TopicDetailView
              topic={topicDetail}
              deleteTopic={deleteTopic}
              updateTopic={onUpdateTopic}
            />
          </Tab>
        </Tabs>
        {deleteModal && (
          <DeleteTopics
            topicName={topicName}
            deleteModal={deleteModal}
            setDeleteModal={setDeleteModal}
            onDeleteTopic={onDeleteTopic}
          />
        )}
      </PageSection>
    </>
  );
};
