import React, { FunctionComponent } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { ConsumerGroupsList } from '../../Modules/ConsumerGroups/ConsumerGroupList/Components/ConsumerGroupList';

export const ConsumerGroupsView: FunctionComponent = () => {
  return <ConsumerGroupsList />;
};

export default ConsumerGroupsView;
