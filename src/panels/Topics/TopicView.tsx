import React, { FunctionComponent } from 'react';
import './style.scss';
import { AppNavigation } from '@app/components/AppNavigation';

const Topics: FunctionComponent = () => {
  return <AppNavigation eventKey={1} />;
};

export { Topics };

export default Topics;
