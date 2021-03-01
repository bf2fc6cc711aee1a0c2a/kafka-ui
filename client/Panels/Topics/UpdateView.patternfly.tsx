import React, { FunctionComponent } from 'react';
import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';
import { UpdateTopic } from '../../Modules/Topics/UpdateTopic/Components/UpdateTopic.patternfly';

const UpdateTopicView: FunctionComponent = () => {
  return <UpdateTopic />;
};

export { UpdateTopicView };

export default UpdateTopicView;
