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
    <EmptyState variant={EmptyStateVariant.xl}>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel='h5' size='4xl'>
        {t('consumerGroup.no_result')}
      </Title>
      <EmptyStateBody>
        {t('consumerGroup.empty_list')}
      </EmptyStateBody>
    </EmptyState>
  );
};
