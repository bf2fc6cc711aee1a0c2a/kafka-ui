import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Title,
  Page,
  Tabs,
  Tab,
  TabTitleText,
} from '@patternfly/react-core';
import { TopicsListComponent } from '../Topics/TopicList/Components/TopicsList';
import { ConsumerGroupsList } from '../ConsumerGroups/ConsumerGroupList/Components/ConsumerGroupList';
import { EllipsisVIcon } from '@patternfly/react-icons/dist/js/icons/ellipsis-v-icon';
import { useHistory } from 'react-router';
interface ITabHeaderProps {
  eventKey: number;
}
export const AppNavigation: React.FunctionComponent<ITabHeaderProps> = ({
  eventKey,
}) => {
  const [activeTabKey, setActiveTabKey] = useState(eventKey);
  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };
  const history = useHistory();

  const onCreateTopic = () => {
    history.push('/topics/create');
  };

  const mainBreadcrumbs = (
    <Breadcrumb>
      <BreadcrumbItem to='#'>Streams for Apache Kafka</BreadcrumbItem>
      <BreadcrumbItem to='#' isActive>
        Kafka Instance Name
      </BreadcrumbItem>
    </Breadcrumb>
  );

  return (
    <PageSection variant={PageSectionVariants.light}>
      <section>{mainBreadcrumbs}</section>
      <PageSection variant={PageSectionVariants.light}>
        <Flex>
          <FlexItem align={{ default: 'alignRight' }}>
            <Button variant='plain' iconPosition='right'>
              <EllipsisVIcon />
            </Button>
          </FlexItem>
        </Flex>
        <Title headingLevel='h1'>Kafka Instance Name</Title>
      </PageSection>
      <br />
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
      >
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab
            title={<TabTitleText>Topics</TabTitleText>}
            eventKey={1}
            id='topics-tab-section'
            aria-label='Topics Tab'
          >
            <Page>
              <PageSection>
                <TopicsListComponent onCreateTopic={onCreateTopic} />
              </PageSection>
            </Page>
          </Tab>
          <Tab
            title={<TabTitleText>Consumer Groups</TabTitleText>}
            eventKey={2}
            id='consumer-groups-tab-section'
            aria-label='Consumer Groups Tab'
          >
            <Page>
              <PageSection>
                <ConsumerGroupsList />
              </PageSection>
            </Page>
          </Tab>
        </Tabs>
      </PageSection>
    </PageSection>
  );
};
