/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
} from '@patternfly/react-core';
import PlusIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';

export interface IEmptyTopic {
  onCreateTopic?: () => void;
}

export const EmptyTopics: React.FunctionComponent<IEmptyTopic> = ({
  onCreateTopic,
}) => {
  return (
    <EmptyState>
      <EmptyStateIcon icon={PlusIcon} />
      <Title headingLevel='h5' size='lg'>
        You don&apos;t have any topics yet
      </Title>
      <EmptyStateBody>
        Create a topic by clicking the button below to get started
      </EmptyStateBody>
      <Button
        variant='primary'
        className='topics-empty-page'
        onClick={onCreateTopic}
      >
        Create Topic
      </Button>
    </EmptyState>
  );
};
