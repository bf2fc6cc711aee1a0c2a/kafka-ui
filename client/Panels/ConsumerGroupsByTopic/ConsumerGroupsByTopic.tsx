/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { ConsumerGroupByTopicList } from 'Elements/Components/ConsumerGroupsByTopic/ConsumerGroupsListByTopic.patternfly';

export const ConsumerGroupsTopicsView: FunctionComponent = () => {
  return <ConsumerGroupByTopicList />;
};

export default ConsumerGroupsTopicsView;
