import React from 'react';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import { ConsumerGroupByTopicList } from '../TopicDetails/Components/ConsumerGroupsByTopic/ConsumerGroupsListByTopic.patternfly';
import { UpdateTopicHead } from './Components/UpdateTopicHead';
import { UpdateTopicView } from './Components/UpdateTopicView';
import { useParams } from 'react-router';

export interface IUpdateTopicRouteParams {
  topicName: string;
}

export const UpdateTopicPage: React.FC = () => {
  const { topicName } = useParams<IUpdateTopicRouteParams>();
  return (
    <>
      <UpdateTopicHead topicName={topicName} />
      <Tabs
        activeKey={1}
        onSelect={() => {
          return;
        }}
        isBox={false}
        className='tab-padding'
      >
        <Tab eventKey={0} title={<TabTitleText>Consumer Groups</TabTitleText>}>
          <ConsumerGroupByTopicList />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Properties</TabTitleText>}>
          <UpdateTopicView />
        </Tab>
      </Tabs>
    </>
  );
};
