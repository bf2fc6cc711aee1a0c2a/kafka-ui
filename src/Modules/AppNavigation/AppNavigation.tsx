import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  PageSection,
  PageSectionVariants,
  Title,
  Page,
  Tabs,
  Level,
  Tab,
  TabTitleText,
  Toolbar,
  ToolbarItem,
  ToolbarContent,
  Select,
  SelectOption,
  SelectVariant

} from '@patternfly/react-core';
import { TopicsListComponent } from '../Topics/TopicList/Components/TopicsList';
import { ConsumerGroupsList } from '../ConsumerGroups/ConsumerGroupList/Components/ConsumerGroupList';
import { EllipsisVIcon } from '@patternfly/react-icons/dist/js/icons/ellipsis-v-icon';
import { useHistory } from 'react-router';
import { Dashboard, DashboardSectionItem } from '../../Panels';
import { DashboardSection } from '../../Panels/Dashboard/DashboardSection';
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

  const onTopicClick = (topic: string) => {
    history.push(`/topic/${topic}`);
  };

  const buildToolbar = (): React.ReactNode => {
    let filterOptions = [
      { value: '1 hour', disabled: false },
      { value: '4 hours', disabled: false },
      { value: '8 hours', disabled: false },
      { value: '12 hours', disabled: false },
      { value: '24 hours', disabled: false }
    ];

    let [selectFilter, setSelectFilter] = useState({isExpanded: false, selection: '1 hour'});

    return (<Toolbar>
      <ToolbarContent>
        <ToolbarItem>
          <Select
            variant={SelectVariant.single}
            aria-label="Chart Duration Filter"
            onToggle={(isExpanded: boolean)=> setSelectFilter({ ...selectFilter, isExpanded: isExpanded})}
            onSelect={(_event, selection) => setSelectFilter({ isExpanded: false, selection: selection as string })}
            selections={selectFilter.selection}
            isOpen={selectFilter.isExpanded}
          >
              {filterOptions.map((option, index) => (
                <SelectOption isDisabled={option.disabled} key={index} value={option.value} />
              ))}
          </Select>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>);
  }
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
      <section>{mainBreadcrumbs}</section>
      <PageSection variant={PageSectionVariants.light}>
        <Level>
          <Title headingLevel='h1'>
            {instanceName ? instanceName : 'Kafka Instance Name'}
          </Title>
          <Button variant='plain' iconPosition='right'>
            <EllipsisVIcon />
          </Button>
        </Level>
      </PageSection>

      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
      >
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
        <Tab
            title={<TabTitleText>Dashboard</TabTitleText>}
            eventKey={1}
            id='dashboard-groups-tab-section'
            aria-label='Dashboard Tab'
          >
            <Page>
              <PageSection>
                <Dashboard>
                  <DashboardSection title="Broker Metrics" toolbar={buildToolbar()}>
                  {Array.apply(0, Array(20)).map((x, i) => (
                    <DashboardSectionItem>test</DashboardSectionItem>
                  ))}
                  </DashboardSection>
                </Dashboard>              
               </PageSection>
            </Page>
          </Tab>
          <Tab
            title={<TabTitleText>Topics</TabTitleText>}
            eventKey={2}
            id='topics-tab-section'
            aria-label='Topics Tab'
          >
            <Page>
              <PageSection>
                <TopicsListComponent
                  onCreateTopic={onCreateTopic}
                  onTopicClick={onTopicClick}
                />
              </PageSection>
            </Page>
          </Tab>
          <Tab
            title={<TabTitleText>Consumer Groups</TabTitleText>}
            eventKey={3}
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
