/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';
import { UpdateTopic } from 'Elements/Components/UpdateTopic/UpdateTopic.patternfly';

const UpdateTopicView: FunctionComponent = () => {
  return <UpdateTopic />;
};

export { UpdateTopicView };

export default UpdateTopicView;
