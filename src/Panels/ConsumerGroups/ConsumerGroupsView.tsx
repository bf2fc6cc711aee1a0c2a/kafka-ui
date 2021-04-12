import React, { FunctionComponent } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { AppNavigation } from '../../Modules/AppNavigation/AppNavigation';

export const ConsumerGroupsView: FunctionComponent = () => {
  return <AppNavigation eventKey={2} />;
};

export default ConsumerGroupsView;
