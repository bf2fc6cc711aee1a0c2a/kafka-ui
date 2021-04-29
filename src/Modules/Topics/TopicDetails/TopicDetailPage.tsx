import React, { useContext, useEffect, useState } from 'react';
import { TopicDetailHead } from '../../../Modules/Topics/TopicDetails/Components/TopicDetailHead';
import { TopicDetailView } from './Components/TopicDetailView';
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
import { IAdvancedTopic } from '../CreateTopic/Components/CreateTopicWizard';
import { useTranslation } from 'react-i18next';

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
  const [topicDetail, setTopicDetail] = useState<IAdvancedTopic>({
    name: topicName,
    numPartitions: '',
    'retention.ms': '',
    'retention.ms.unit': 'milliseconds',
    'retention.bytes': '',
    'retention.bytes.unit': 'bytes',
    'cleanup.policy': '',
  });
  const [activeTabKey, setActiveTabKey] = useState(eventKey);
  const config = useContext(ConfigContext);
  const [deleteModal, setDeleteModal] = useState(false);
  const { addAlert } = useContext(AlertContext);
  const history = useHistory();

  const { t } = useTranslation();

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
            addAlert(
              t('topic.topic_not_found', { name: topicName }),
              AlertVariant.danger
            );
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
            title={
              <TabTitleText>{t('consumerGroup.consumer_groups')}</TabTitleText>
            }
            className={activeTabKey === 1 ? 'kafka-ui--consumer-content' : ''}
          >
            <ConsumerGroupsList
              onDeleteConsumerGroup={onDeleteConsumer}
              consumerGroupByTopic={true}
              topic={topicName}
              rowDataId='tableTopicConsumers-row'
              detailsDataId='tableTopicConsumers-actionDetails'
            />
          </Tab>
          <Tab
            eventKey={2}
            title={<TabTitleText>{t('common.properties')}</TabTitleText>}
            data-testid='pageTopic-tabProperties'
            tabContentId='kafka-ui-TabcontentProperties'
            tabContentRef={contentRefProperties}
          />
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
          className='kafka-ui-m-full-height'
          aria-label='Consumer groups.'
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
          id='kafka-ui-TabcontentProperties'
          ref={contentRefProperties}
          className='kafka-ui-m-full-height'
          aria-label='Topic properties.'
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
