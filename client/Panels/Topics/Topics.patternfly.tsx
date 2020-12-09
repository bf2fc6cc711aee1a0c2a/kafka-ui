/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';
import { TopicsList } from '../../Elements/Components/Topics/TopicsList.patternfly';

const Topics: FunctionComponent = () => {
  return <TopicsList />;
};

export { Topics };

export default Topics;
