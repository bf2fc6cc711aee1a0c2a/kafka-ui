import React from 'react';
import {
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  Bullseye,
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/js/icons/cubes-icon';

export const EmptyConsumers: React.FunctionComponent = () => {
  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h4" size="lg">
          No consumer groups yet
        </Title>
        <EmptyStateBody>When configuring an application client to access Kafka, assign a group ID to associate the consumer with a consumer group.</EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );
};
