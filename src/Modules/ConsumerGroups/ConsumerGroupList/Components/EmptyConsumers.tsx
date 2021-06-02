import React from 'react';
import {
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/js/icons/cubes-icon';
import { useTranslation } from 'react-i18next';

export const EmptyConsumers: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
      <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel='h4' size='lg'>
          {t('consumerGroup.empty_consumer_title')}
        </Title>
        <EmptyStateBody>{t('consumerGroup.empty_consumer_body')}</EmptyStateBody>
      </EmptyState>

  );
};
