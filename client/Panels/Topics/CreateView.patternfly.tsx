/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';
import { CreateTopicWizard } from '../../Elements/Components/CreateTopic/CreateTopicWizard.patternfly';

const CreateTopic: FunctionComponent = () => {
  return <CreateTopicWizard />;
};

export { CreateTopic };

export default CreateTopic;
