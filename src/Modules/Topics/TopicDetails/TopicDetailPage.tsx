import React, { useContext, useEffect, useState } from 'react';
import { TopicDetailHead } from '../../../Modules/Topics/TopicDetails/Components/TopicDetailHead';
import { TopicDetailView } from './Components/TopicDetailView';
import { AdvancedTopic, initialState } from '../../../Contexts/Topic';
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


export const TopicDetailGroup: React.FC<TopicDetailGroupProps> = ({
  topicName,
  onUpdateTopic,
  getTopicListPath,
  onClickTopicList,
  onDeleteTopic,
  onError,
  eventKey,
}) => {
  const [topicDetail, setTopicDetail] = useState<AdvancedTopic>(initialState);
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
