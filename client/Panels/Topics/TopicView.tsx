import React, { FunctionComponent } from 'react';

import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';
import { AppNavigation } from 'Modules/AppNavigation/AppNavigation';
const Topics: FunctionComponent = () => {
  return <AppNavigation eventKey={1} />;
};

export { Topics };

export default Topics;
