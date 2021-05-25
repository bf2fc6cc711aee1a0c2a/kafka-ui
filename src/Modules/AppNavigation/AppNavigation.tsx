import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  PageSection,
  PageSectionVariants,
  Title,
  Tabs,
  Level,
  Tab,
  TabTitleText,
  TabContent,
} from '@patternfly/react-core';
import { TopicsListComponent } from '../Topics/TopicList/Components/TopicsList';
import { ConsumerGroupsList } from '../ConsumerGroups/ConsumerGroupList/Components/ConsumerGroupList';
import { EllipsisVIcon } from '@patternfly/react-icons/dist/js/icons/ellipsis-v-icon';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
interface ITabHeaderProps {
  eventKey: number;
  instanceName?: string;
}
export const AppNavigation: React.FunctionComponent<ITabHeaderProps> = ({
  eventKey,
  instanceName,
}) => {
  const { t } = useTranslation();

  const [activeTabKey, setActiveTabKey] = useState(eventKey);
  const contentRefConsumerGroups = React.createRef<HTMLElement>();
  const contentRefTopics = React.createRef<HTMLElement>();

  const handleTabClick = (_event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const history = useHistory();

  const onCreateTopic = () => {
    history.push('/topics/create');
  };

  const getTopicDetailsPath = (topic: string | undefined) => {
    return `/topic/${topic}`;
  };

  const onClickTopic = (topic: string | undefined) => {
    history.push(`/topic/${topic}`);
  };

  const onDeleteTopic = () => {
    history.push('/topics');
  };

  const onDeleteConsumer = () => {
    history.push('/consumerGroups');
  };

  const mainBreadcrumbs = (
    <Breadcrumb>
      <BreadcrumbItem to='#'>{t('common.kafka_instance')}</BreadcrumbItem>
      <BreadcrumbItem to='#' isActive>
        {instanceName ? instanceName : t('common.kafka_instance_name')}
      </BreadcrumbItem>
    </Breadcrumb>
  );

  return (
    <>
      <section className='pf-c-page__main-breadcrumb'>
        {mainBreadcrumbs}
      </section>

      <PageSection variant={PageSectionVariants.light}>
        <Level>
          <Title headingLevel='h1'>
            {instanceName ? instanceName : t('common.kafka_instance_name')}
          </Title>
          <Button variant='plain' iconPosition='right'>
            <EllipsisVIcon />
          </Button>
        </Level>
      </PageSection>
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
        className='pf-c-page__main-tabs'
      >
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          data-testid='pageKafka-tabProperties'
          className='pf-m-page-insets'
        >
          <Tab
            title={<TabTitleText>{t('topic.topics')}</TabTitleText>}
            eventKey={1}
            data-testid='pageKafka-tabTopics'
            id='topics-tab-section'
            aria-label={t('topic.topics')}
            tabContentRef={contentRefTopics}
            tabContentId='kafka-ui-TabcontentTopicsList'
            // className='kafka-ui-m-full-height'
          >
          </Tab>
          <Tab
            title={
              <TabTitleText>{t('consumerGroup.consumer_groups')}</TabTitleText>
            }
            eventKey={2}
            data-testid='pageKafka-tabConsumers'
            id='consumer-groups-tab-section'
            aria-label={t('consumerGroup.consumer_groups')}
            tabContentRef={contentRefConsumerGroups}
            tabContentId='kafka-ui-TabcontentConsumersList'
            // className='kafka-ui-m-full-height'
          >
          </Tab>
        </Tabs>
      </PageSection>
      <PageSection isFilled>
        <TabContent eventKey={1}
        ref={contentRefTopics}
        id='kafka-ui-TabcontentTopicsList'
        className='kafka-ui-m-full-height'
        aria-label={t('topic.topics')}
        >
        <TopicsListComponent
                      onCreateTopic={onCreateTopic}
                      onClickTopic={onClickTopic}
                      getTopicDetailsPath={getTopicDetailsPath}
                      onDeleteTopic={onDeleteTopic}
                    />
        </TabContent>
        <TabContent
          eventKey={2}
          ref={contentRefConsumerGroups}
          id='kafka-ui-TabcontentConsumersList'
          className='kafka-ui-m-full-height'
          aria-label={t('consumerGroup.consumer_groups')}
          hidden
        >
            <ConsumerGroupsList
              onDeleteConsumerGroup={onDeleteConsumer}
              consumerGroupByTopic={false}
            />
        </TabContent>
      </PageSection>
    </>
  );
};
