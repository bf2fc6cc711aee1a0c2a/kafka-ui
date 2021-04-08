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
} from '@patternfly/react-core';
import { TopicsListComponent } from '../Topics/TopicList/Components/TopicsList';
import { ConsumerGroupsList } from '../ConsumerGroups/ConsumerGroupList/Components/ConsumerGroupList';
import { EllipsisVIcon } from '@patternfly/react-icons/dist/js/icons/ellipsis-v-icon';
import { useHistory } from 'react-router';
interface ITabHeaderProps {
  eventKey: number;
  instanceName?: string;
}
export const AppNavigation: React.FunctionComponent<ITabHeaderProps> = ({
  eventKey,
  instanceName,
}) => {
  const [activeTabKey, setActiveTabKey] = useState(eventKey);
  const handleTabClick = (event, tabIndex) => {
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
      <BreadcrumbItem to='#'>Kafka Instance</BreadcrumbItem>
      <BreadcrumbItem to='#' isActive>
        {instanceName ? instanceName : 'Kafka Instance Name'}
      </BreadcrumbItem>
    </Breadcrumb>
  );

  return (
    <PageSection variant={PageSectionVariants.light}>
      {mainBreadcrumbs}

      <Level>
        <Title headingLevel='h1'>
          {instanceName ? instanceName : 'Kafka Instance Name'}
        </Title>
        <Button variant='plain' iconPosition='right'>
          <EllipsisVIcon />
        </Button>
      </Level>

      <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
        <Tab
          title={<TabTitleText>Topics</TabTitleText>}
          eventKey={1}
          id='topics-tab-section'
          aria-label='Topics Tab'
        >
          <TopicsListComponent
            onCreateTopic={onCreateTopic}
            onClickTopic={onClickTopic}
            getTopicDetailsPath={getTopicDetailsPath}
            onDeleteTopic={onDeleteTopic}
          />
        </Tab>
        <Tab
          title={<TabTitleText>Consumer Groups</TabTitleText>}
          eventKey={2}
          id='consumer-groups-tab-section'
          aria-label='Consumer Groups Tab'
        >
          <ConsumerGroupsList onDeleteConsumerGroup={onDeleteConsumer} />
        </Tab>
      </Tabs>
    </PageSection>
  );
};
