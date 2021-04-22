import React, { FunctionComponent, useState } from 'react';
import './style.scss';
import { TopicsListComponent } from '../../Modules/Topics/TopicList/Components/TopicsList';
import { ConfigContext } from '../../Contexts';
import {
  AlertVariant,
  Breadcrumb,
  BreadcrumbItem,
  Title,
  Tabs,
  Level,
  Tab,
  TabTitleText,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import kafkai18n from '../../i18n';
import { I18nextProvider } from 'react-i18next';
import { AlertContext, AlertContextProps } from '../../Contexts/Alert';
import { BrowserRouter } from 'react-router-dom';
import { FederatedProps } from '../../Utils';
import { ConsumerGroupsList } from '../../Modules/ConsumerGroups/ConsumerGroupList/Components/ConsumerGroupList';

export interface FederatedMainViewProps extends FederatedProps {
  getToken: () => Promise<string>;
  apiBasePath: string;
  activeTab?: number;
  kafkaName?: string;
  kafkaPageLink?: string;
  onCreateTopic: () => void;
  onClickTopic: (topicName: string | undefined) => void;
  getTopicDetailsPath: (topic: string | undefined) => string;
  addAlert: (message: string, variant?: AlertVariant) => void;
  onDeleteConsumer: () => void;
  onDeleteTopic: () => void;
}

const FederatedMainView: FunctionComponent<FederatedMainViewProps> = ({
  getToken,
  activeTab = 0,
  apiBasePath,
  kafkaName,
  kafkaPageLink,
  onCreateTopic,
  getTopicDetailsPath,
  onClickTopic,
  addAlert,
  onDeleteConsumer,
  onDeleteTopic,
  onError,
}) => {
  const alertContext = {
    addAlert,
  } as AlertContextProps;

  const [activeTabKey, setActiveTabKey] = useState(activeTab);

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const buildMainView = () => {
    const mainBreadcrumbs = (
      <Breadcrumb>
        <BreadcrumbItem to={kafkaPageLink ? kafkaPageLink : '#'}>
          Kafka Instances
        </BreadcrumbItem>
        <BreadcrumbItem to='#' isActive>
          {kafkaName ? kafkaName : 'Kafka Instance Name'}
        </BreadcrumbItem>
      </Breadcrumb>
    );

    return (
      <>
        {mainBreadcrumbs}
     
        <Level>
          <Title headingLevel='h1'>
            {kafkaName ? kafkaName : 'Kafka Instance Name'}
          </Title>
          {/* TODO: Add this back once we get the options available to us for this menu <Button variant='plain' iconPosition='right'>
            <EllipsisVIcon />
          </Button> */}
        </Level>

        {/* <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
        > */}

        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab
            title={<TabTitleText>Topics</TabTitleText>}
            eventKey={0}
            id='topics-tab-section'
            aria-label='Topics Tab'
            data-testid='pageKafka-tabTopics'
          >
            <TopicsListComponent
              onCreateTopic={onCreateTopic}
              onClickTopic={onClickTopic}
              getTopicDetailsPath={getTopicDetailsPath}
              onDeleteTopic={onDeleteTopic}
              onError={onError}
            />
          </Tab>
          <Tab
            title={<TabTitleText>Consumer Groups</TabTitleText>}
            eventKey={1}
            id='consumer-groups-tab-section'
            aria-label='Consumer Groups Tab'
            data-testid='pageKafka-tabConsumers'
            className={activeTabKey === 1 ? 'kafka-ui--consumer-content' : ''}
          >
            <ConsumerGroupsList
              onDeleteConsumerGroup={onDeleteConsumer}
              consumerGroupByTopic={false}
            />
          </Tab>
        </Tabs>
        {/* </PageSection> */}
      </>
    );
  };

  return (
    // TODO don't add BrowserRouter here - see  https://github.com/bf2fc6cc711aee1a0c2a/mk-ui-frontend/issues/74
    <BrowserRouter>
      <I18nextProvider i18n={kafkai18n}>
        <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
          <AlertContext.Provider value={alertContext}>
            <PageSection variant={PageSectionVariants.light}>
              {buildMainView()}
            </PageSection>
          </AlertContext.Provider>
        </ConfigContext.Provider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

export { FederatedMainView };

export default FederatedMainView;
