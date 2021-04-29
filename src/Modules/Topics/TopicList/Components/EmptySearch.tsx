import React from 'react';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import { useTranslation } from 'react-i18next';

export const EmptySearch: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <EmptyState>
      <EmptyStateIcon icon={SearchIcon} />
      <Title headingLevel='h5' size='lg'>
        {t('topic.no_result_head')}
      </Title>
      <EmptyStateBody>{t('topic.no_result_body')}</EmptyStateBody>
    </EmptyState>
  );
};
