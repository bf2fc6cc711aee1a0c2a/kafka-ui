import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  PageSectionVariants,
  Title,
  Tabs,
  Level,
  Tab,
  TabTitleText,
  TabContent,
  Dropdown,
  DropdownPosition,
  KebabToggle,
  DropdownItem,
} from '@patternfly/react-core';
import { Topics, TopicsProps } from '@app/modules/Topics/Topics';
import { ConsumerGroups } from '@app/modules/ConsumerGroups';
import { useFederated } from '@app/contexts';
import '../style.css';

export type MainViewProps = TopicsProps & {
  activeTab?: number;
};

export const MainView: React.FC<MainViewProps> = ({
  onCreateTopic,
  onEditTopic,
  activeTab,
}) => {
  const { t } = useTranslation();
  const {
    kafkaPageLink,
    kafkaName,
    handleInstanceDrawer,
    setIsOpenDeleteInstanceModal,
    showMetrics,
  } = useFederated();

  const [activeTabKey, setActiveTabKey] = useState(activeTab);
  const contentRefConsumerGroups = React.createRef<HTMLElement>();
  const contentRefTopics = React.createRef<HTMLElement>();
  const contentRefDashboard = React.createRef<HTMLElement>();

  const handleTabClick = (_event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const [isOpen, setIsOpen] = useState<boolean>();

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect = () => {
    setIsOpen(!isOpen);
  };

  const onSelectKebabOption = (activeTab: string) => {
    handleInstanceDrawer && handleInstanceDrawer(true, activeTab);
  };

  const onDeleteInstance = () => {
    setIsOpenDeleteInstanceModal && setIsOpenDeleteInstanceModal(true);
  };

  const dropdownItems = [
    <DropdownItem
      key='view-kafka'
      onClick={() => onSelectKebabOption('details')}
    >
      {t('common.view_instance')}
    </DropdownItem>,
    <DropdownItem
      key='connect-kafka'
      onClick={() => onSelectKebabOption('connection')}
    >
      {t('common.view_connection')}
    </DropdownItem>,
    <DropdownItem key='delete-kafka' onClick={onDeleteInstance}>
      {t('common.delete_instance')}
    </DropdownItem>,
  ];

  const mainBreadcrumbs = (
    <Breadcrumb>
      <BreadcrumbItem to={kafkaPageLink || '#'}>
        {t('common.kafka_instance')}
      </BreadcrumbItem>
      <BreadcrumbItem to='#' isActive>
        {kafkaName || t('common.kafka_instance_name')}
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
            {kafkaName ? kafkaName : t('common.kafka_instance_name')}
          </Title>
          <Dropdown
            onSelect={onSelect}
            toggle={<KebabToggle onToggle={onToggle} id='toggle-data-plane' />}
            isOpen={isOpen}
            isPlain
            dropdownItems={dropdownItems}
            position={DropdownPosition.right}
          />
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
            title={<TabTitleText>{t('dashboard.dashboard')}</TabTitleText>}
            eventKey={1}
            data-testid='pageKafka-tabDashboard'
            id='dashboard-tab-section'
            aria-label={t('dashboard.dashboard')}
            tabContentRef={contentRefDashboard}
            tabContentId='kafka-ui-TabcontentDashboard'
            // className="kafka-ui-m-full-height"
          />
          <Tab
            title={<TabTitleText>{t('topic.topics')}</TabTitleText>}
            eventKey={2}
            data-testid='pageKafka-tabTopics'
            id='topics-tab-section'
            aria-label={t('topic.topics')}
            tabContentRef={contentRefTopics}
            tabContentId='kafka-ui-TabcontentTopicsList'
            // className="kafka-ui-m-full-height"
          />
          <Tab
            title={
              <TabTitleText>{t('consumerGroup.consumer_groups')}</TabTitleText>
            }
            eventKey={3}
            data-testid='pageKafka-tabConsumers'
            id='consumer-groups-tab-section'
            aria-label={t('consumerGroup.consumer_groups')}
            tabContentRef={contentRefConsumerGroups}
            tabContentId='kafka-ui-TabcontentConsumersList'
            // className='kafka-ui-m-full-height'
          />
        </Tabs>
      </PageSection>
      <PageSection isFilled>
        <TabContent
          eventKey={1}
          ref={contentRefDashboard}
          id='kafka-ui-TabcontentDashboard'
          className='kafka-ui-m-full-height'
          aria-label={t('dashboard.dashboard')}
        >
          {showMetrics}
        </TabContent>
        <TabContent
          eventKey={2}
          ref={contentRefTopics}
          id='kafka-ui-TabcontentTopicsList'
          className='kafka-ui-m-full-height'
          aria-label={t('topic.topics')}
          hidden
        >
          <Topics onCreateTopic={onCreateTopic} onEditTopic={onEditTopic} />
        </TabContent>
        <TabContent
          eventKey={3}
          ref={contentRefConsumerGroups}
          id='kafka-ui-TabcontentConsumersList'
          className='kafka-ui-m-full-height'
          aria-label={t('consumerGroup.consumer_groups')}
          hidden
        >
          <ConsumerGroups consumerGroupByTopic={false} />
        </TabContent>
      </PageSection>
    </>
  );
};
