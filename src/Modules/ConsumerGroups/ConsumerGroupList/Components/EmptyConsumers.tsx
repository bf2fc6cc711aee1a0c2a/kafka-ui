import React from 'react';
import {
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/js/icons/cubes-icon';

export const EmptyConsumers: React.FunctionComponent = () => {
  return (
    <EmptyState variant={EmptyStateVariant.xl}>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel='h5' size='4xl'>
        No Consumer Groups Found
      </Title>
      <EmptyStateBody>You have No Consumer Groups</EmptyStateBody>
    </EmptyState>
  );
};
