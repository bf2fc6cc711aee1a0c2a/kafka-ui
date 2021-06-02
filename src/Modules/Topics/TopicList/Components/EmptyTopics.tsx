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
        <Title headingLevel='h4' size='lg'>
          {t('topic.empty_list_head')}
        </Title>
        <EmptyStateBody>{t('topic.empty_list_body')}</EmptyStateBody>
        <Button
          variant='primary'
          className='topics-empty-page'
          onClick={onCreateTopic}
        >
          {t('topic.create_topic')}
        </Button>
      </EmptyState>
  );
};
