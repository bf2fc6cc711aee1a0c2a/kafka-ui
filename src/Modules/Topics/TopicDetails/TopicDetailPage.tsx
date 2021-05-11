import React, { useContext, useEffect, useState } from 'react';
import { TopicDetailHead } from '../../../Modules/Topics/TopicDetails/Components/TopicDetailHead';
import { TopicDetailView } from './Components/TopicDetailView';
import { AdvancedTopic, initialState } from '../../../Contexts/Topic';
import {
  AlertVariant,
  PageSection,
  PageSectionVariants,
  Tab,
  TabContent,
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
  kafkaName?: string;
  kafkaPageLink?: string;
  kafkaInstanceLink?: string;
  onUpdateTopic: () => void;
  onClickTopicList: () => void;
  onDeleteTopic: () => void;
  onError?: (errorCode: number, message: string) => void;
  eventKey: number;
};

export const TopicDetailGroup: React.FC<TopicDetailGroupProps> = ({
  topicName,
  kafkaName,
  kafkaPageLink,
  kafkaInstanceLink,
  onUpdateTopic,
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
            onError(err.response?.data.code, err.response?.data.error_message);
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

  const contentRefConsumerGroup = React.createRef<HTMLElement>();
  const contentRefProperties = React.createRef<HTMLElement>();

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
        kafkaName={kafkaName}
        kafkaPageLink={kafkaPageLink}
        kafkaInstanceLink={kafkaInstanceLink}
      />
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
        className='pf-c-page__main-tabs'
      >
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          isBox={false}
          className='pf-m-page-insets'
        >
          <Tab
            eventKey={1}
            data-testid='pageTopic-tabConsumers'
            title={<TabTitleText>Consumer groups</TabTitleText>}
            tabContentId='kafka-ui-TabcontentConsumerGroupList'
            tabContentRef={contentRefConsumerGroup}
          ></Tab>
          <Tab
            eventKey={2}
            title={<TabTitleText>Properties</TabTitleText>}
            data-testid='pageTopic-tabProperties'
            tabContentId='kafka-ui-TabcontentProperties'
            tabContentRef={contentRefProperties}
          ></Tab>
        </Tabs>
      </PageSection>
      <PageSection
        variant={
          activeTabKey === 2
            ? PageSectionVariants.light
            : PageSectionVariants.default
        }
      >
        <TabContent
          eventKey={1}
          id='kafka-ui-TabcontentConsumerGroupList'
          ref={contentRefConsumerGroup}
          hidden
        >
          <ConsumerGroupsList
            onDeleteConsumerGroup={onDeleteConsumer}
            consumerGroupByTopic={true}
            topic={topicName}
            rowDataId='tableTopicConsumers-row'
            detailsDataId='tableTopicConsumers-actionDetails'
          />
        </TabContent>
        <TabContent
          eventKey={2}
          id='kafka-ui-TabcontentConsumerGroups'
          ref={contentRefProperties}
        >
          <TopicDetailView
            topic={topicDetail}
            deleteTopic={deleteTopic}
            updateTopic={onUpdateTopic}
          />
        </TabContent>
      </PageSection>
      {deleteModal && (
        <DeleteTopics
          topicName={topicName}
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          onDeleteTopic={onDeleteTopic}
        />
      )}
    </>
  );
};
