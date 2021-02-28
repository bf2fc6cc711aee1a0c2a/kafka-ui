import React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
} from '@patternfly/react-core';
import PlusIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { useTranslation } from 'react-i18next';

export interface IEmptyTopic {
  onCreateTopic?: () => void;
}

export const EmptyTopics: React.FunctionComponent<IEmptyTopic> = ({
  onCreateTopic,
}) => {

  const { t } = useTranslation();
  
  return (
    <EmptyState>
      <EmptyStateIcon icon={PlusIcon} />
      <Title headingLevel='h5' size='lg'>
        {t('topicList.emptyTopicHead')}
      </Title>
      <EmptyStateBody>
        {t('topicList.emptyTopicBody')}
      </EmptyStateBody>
      <Button
        variant='primary'
        className='topics-empty-page'
        onClick={onCreateTopic}
      >
        {t('createTopic.createTopic')}
      </Button>
    </EmptyState>
  );
};
