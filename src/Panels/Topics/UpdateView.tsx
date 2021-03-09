import React, { FunctionComponent } from 'react';
import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';
import { UpdateTopicPage } from 'src/Modules/Topics/UpdateTopic/UpdateTopicPage';

const UpdateTopic: FunctionComponent = () => {
  return <UpdateTopicPage />;
};

export { UpdateTopic };

export default UpdateTopic;
