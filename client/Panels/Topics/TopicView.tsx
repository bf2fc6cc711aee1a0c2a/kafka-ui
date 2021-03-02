import React, { FunctionComponent } from 'react';

import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';
import { TabHeaders } from 'Modules//OpenShiftStreams/TabHeaders/TabHeaders';
const Topics: FunctionComponent = () => {
  return <TabHeaders eventKey={1} />;
};

export { Topics };

export default Topics;
