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
      >
        <Tab
          title={<TabTitleText>{t('topic.topics')}</TabTitleText>}
          eventKey={1}
          data-testid='pageKafka-tabTopics'
          id='topics-tab-section'
          aria-label={t('topic.topics')}
          className='kafka-ui-m-full-height'
        >
          <TopicsListComponent
            onCreateTopic={onCreateTopic}
            onClickTopic={onClickTopic}
            getTopicDetailsPath={getTopicDetailsPath}
            onDeleteTopic={onDeleteTopic}
          />  
        </Tab>
        <Tab
          title={
            <TabTitleText>{t('consumerGroup.consumer_groups')}</TabTitleText>
          }
          eventKey={2}
          data-testid='pageKafka-tabConsumers'
          id='consumer-groups-tab-section'
          aria-label={t('consumerGroup.consumer_groups')}
          className='kafka-ui-m-full-height'
        >
           <ConsumerGroupsList
            onDeleteConsumerGroup={onDeleteConsumer}
            consumerGroupByTopic={false}
          />
        </Tab>
        </Tabs>
        </PageSection>
      
    </>
  );
};
