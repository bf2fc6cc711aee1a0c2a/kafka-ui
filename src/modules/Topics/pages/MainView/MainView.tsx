import React, { lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
  Level,
  PageSection,
  PageSectionVariants,
  Tab,
  TabContent,
  Tabs,
  TabTitleText,
  Title,
} from '@patternfly/react-core';
import { useFederated } from '@app/contexts';
import { MASLoading } from '@app/components';
import '../style.css';
import PermissionsTableView from '@app/modules/Permissions/pages/PermissionsTable/PermissionsTableView';

const Topics = lazy(() => import('@app/modules/Topics/Topics'));
const ConsumerGroups = lazy(
  () => import('@app/modules/ConsumerGroups/ConsumerGroups')
);

export const MainView: React.FC = () => {
  const { t } = useTranslation();
  const {
    kafkaPageLink,
    kafkaName,
    handleInstanceDrawer,
    setIsOpenDeleteInstanceModal,
    showMetrics,
    activeTab,
  } = useFederated() || {};

  const [activeTabKey, setActiveTabKey] = useState(activeTab || 1);
  const contentRefConsumerGroups = React.createRef<HTMLElement>();
  const contentRefTopics = React.createRef<HTMLElement>();
  const contentRefDashboard = React.createRef<HTMLElement>();
  const contentRefPermissions = React.createRef<HTMLElement>();

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
      <React.Suspense fallback={<MASLoading />}>
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
            />
            <Tab
              title={<TabTitleText>{t('topic.topics')}</TabTitleText>}
              eventKey={2}
              data-testid='pageKafka-tabTopics'
              id='topics-tab-section'
              aria-label={t('topic.topics')}
              tabContentRef={contentRefTopics}
              tabContentId='kafka-ui-TabcontentTopicsList'
            />
            <Tab
              title={
                <TabTitleText>
                  {t('consumerGroup.consumer_groups')}
                </TabTitleText>
              }
              eventKey={3}
              data-testid='pageKafka-tabConsumers'
              id='consumer-groups-tab-section'
              aria-label={t('consumerGroup.consumer_groups')}
              tabContentRef={contentRefConsumerGroups}
              tabContentId='kafka-ui-TabcontentConsumersList'
            />
            <Tab
              title={<TabTitleText>{t('permission.tab.label')}</TabTitleText>}
              eventKey={4}
              data-testid='pageKafka-tabPermissions'
              id='permissions-tab-section'
              aria-label={t('permission.tab.label')}
              tabContentRef={contentRefPermissions}
              tabContentId='kafka-ui-TabcontentPermissions'
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
            hidden={activeTabKey !== 1}
          >
            {showMetrics}
          </TabContent>
          <TabContent
            eventKey={2}
            ref={contentRefTopics}
            id='kafka-ui-TabcontentTopicsList'
            className='kafka-ui-m-full-height'
            aria-label={t('topic.topics')}
            hidden={activeTabKey !== 2}
          >
            <Topics />
          </TabContent>
          <TabContent
            eventKey={3}
            ref={contentRefConsumerGroups}
            id='kafka-ui-TabcontentConsumersList'
            className='kafka-ui-m-full-height'
            aria-label={t('consumerGroup.consumer_groups')}
            hidden={activeTabKey != 3}
          >
            <ConsumerGroups consumerGroupByTopic={false} />
          </TabContent>
          <TabContent
            eventKey={4}
            ref={contentRefPermissions}
            id='kafka-ui-TabcontentPermissions'
            className='kafka-ui-m-full-height'
            aria-label={t('permission.tab.label')}
            hidden
          >
            <PermissionsTableView kafkaName={kafkaName} />
          </TabContent>
        </PageSection>
      </React.Suspense>
    </>
  );
};
