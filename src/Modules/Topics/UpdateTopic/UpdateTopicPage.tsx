import React from 'react';
import {
  Tabs,
  Tab,
  TabTitleText,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import { ConsumerGroupByTopicList } from '../TopicDetails/Components/ConsumerGroupsByTopic/ConsumerGroupsListByTopic.patternfly';
import { UpdateTopicHead } from './Components/UpdateTopicHead';
import { UpdateTopicView } from './Components/UpdateTopicView';

export interface UpdateTopicPageProps {
  topicName: string;
}

export const UpdateTopicPage: React.FunctionComponent<UpdateTopicPageProps> = ({
  topicName,
}) => {
  return (
    <>
      <UpdateTopicHead topicName={topicName} />
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
      >
        {/* <div> */}
        <Tabs
          activeKey={1}
          onSelect={() => {
            return;
          }}
          isBox={false}
          className='tab-padding'
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>Consumer Groups</TabTitleText>}
          >
            <ConsumerGroupByTopicList />
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Properties</TabTitleText>}>
            <PageSection variant='light'>
              <UpdateTopicView topicName={topicName} />
            </PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};
