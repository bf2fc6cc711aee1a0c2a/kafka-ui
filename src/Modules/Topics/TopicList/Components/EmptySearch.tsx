import React from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';

export const EmptySearch: React.FunctionComponent = () => {
  return (
    <Bullseye>
      <EmptyState>
        <EmptyStateIcon icon={SearchIcon} />
        <Title headingLevel='h4' size='lg'>
          No results found
        </Title>
        <EmptyStateBody>
          No result match the filter criteria. Remove filter or clear all filters
          to show results.
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );
};
