import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
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
  Tabs,
  TabsProps,
  TabTitleText,
  Title,
} from '@patternfly/react-core';
import { useFederated } from '@app/contexts';

export type MainViewHeaderProps = {
  activeTabKey: number;
};

const MainViewHeader: React.FC<MainViewHeaderProps> = ({ activeTabKey }) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const history = useHistory();

  const { kafkaPageLink, kafkaName, handleInstanceDrawer, onDeleteInstance } =
    useFederated() || {};

  const [isOpen, setIsOpen] = useState<boolean>();

  const onSelect = () => {
    setIsOpen(!isOpen);
  };

  const onSelectKebabOption = (activeTab: string) => {
    handleInstanceDrawer && handleInstanceDrawer(true, activeTab);
  };

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelectTab: TabsProps['onSelect'] = (_, tabKey: string | number) => {
    let redirectPath;
    switch (tabKey) {
      case 1:
        redirectPath = 'dashboard';
        break;
      case 2:
        redirectPath = 'topics';
        break;
      case 3:
        redirectPath = 'consumer-groups';
        break;
      case 4:
        redirectPath = 'acls';
        break;
      default:
        redirectPath = 'dashboard';
        break;
    }

    history.push(redirectPath);
  };

  const mainBreadcrumbs = (
    <Breadcrumb>
      <BreadcrumbItem
        render={() => (
          <Link to={kafkaPageLink || '#'}>{t('common.kafka_instance')}</Link>
        )}
      />
      <BreadcrumbItem to='#' isActive>
        {kafkaName || t('common.kafka_instance_name')}
      </BreadcrumbItem>
    </Breadcrumb>
  );

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
          onSelect={onSelectTab}
          data-testid='pageKafka-tabProperties'
          className='pf-m-page-insets'
        >
          <Tab
            title={<TabTitleText>{t('dashboard.dashboard')}</TabTitleText>}
            eventKey={1}
            data-testid='pageKafka-tabDashboard'
            id='dashboard-tab-section'
            aria-label={t('dashboard.dashboard')}
            tabContentId='kafka-ui-TabcontentDashboard'
          />
          <Tab
            title={<TabTitleText>{t('topic.topics')}</TabTitleText>}
            eventKey={2}
            data-testid='pageKafka-tabTopics'
            id='topics-tab-section'
            aria-label={t('topic.topics')}
            tabContentId='kafka-ui-TabcontentTopicsList'
          />
          <Tab
            title={
              <TabTitleText>{t('consumerGroup.consumer_groups')}</TabTitleText>
            }
            eventKey={3}
            data-testid='pageKafka-tabConsumers'
            id='consumer-groups-tab-section'
            aria-label={t('consumerGroup.consumer_groups')}
            tabContentId='kafka-ui-TabcontentConsumersList'
          />
          <Tab
            title={<TabTitleText>{t('permission.tab.label')}</TabTitleText>}
            eventKey={4}
            data-testid='pageKafka-tabPermissions'
            id='permissions-tab-section'
            aria-label={t('permission.tab.label')}
            tabContentId='kafka-ui-TabcontentPermissions'
          />
        </Tabs>
      </PageSection>
    </>
  );
};

export { MainViewHeader };
