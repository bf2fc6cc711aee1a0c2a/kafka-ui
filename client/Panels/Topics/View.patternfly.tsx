/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router';
import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';
import { TopicsList } from '../../Elements/Components/Topics/TopicsList.patternfly';

const Topics: FunctionComponent = () => {
  const history = useHistory();

  const onCreateTopic = () => {
    history.push('/topics/create');
  };

  return <TopicsList onCreateTopic={onCreateTopic} />;
};

export { Topics };

export default Topics;
