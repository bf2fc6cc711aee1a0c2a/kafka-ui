import React, { FunctionComponent } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { ConsumerGroupByTopicList } from 'Modules/Topics/TopicDetails/Components/ConsumerGroupsByTopic/ConsumerGroupsListByTopic.patternfly';

export const ConsumerGroupsTopicsView: FunctionComponent = () => {
  return <ConsumerGroupByTopicList />;
};

export default ConsumerGroupsTopicsView;
