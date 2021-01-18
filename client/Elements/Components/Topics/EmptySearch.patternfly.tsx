/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React from 'react';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';

export const EmptySearch: React.FunctionComponent = () => {
  return (
    <EmptyState>
      <EmptyStateIcon icon={SearchIcon} />
      <Title headingLevel='h5' size='lg'>
        No results found
      </Title>
      <EmptyStateBody>
        No result match the filter criteria. Remove filter or clear all filters
        to show results
      </EmptyStateBody>
    </EmptyState>
  );
};
