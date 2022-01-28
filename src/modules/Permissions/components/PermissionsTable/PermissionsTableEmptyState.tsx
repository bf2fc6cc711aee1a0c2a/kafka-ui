import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState, MASEmptyStateVariant } from '@app/components';

export type PermissionsTableEmptyStateProps = {
  openManagePermissions?: () => void;
};
export const PermissionsTableEmptyState: React.FunctionComponent<
  PermissionsTableEmptyStateProps
> = ({ openManagePermissions }) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  return (
    <EmptyState
      emptyStateProps={{
        variant: MASEmptyStateVariant.NoResult,
      }}
      titleProps={{
        title: t('permission.table.no_results_title'),
      }}
      emptyStateBodyProps={{
        body: t('permission.table.no_results_body'),
      }}
      buttonProps={{
        title: t('permission.table.manage_permissions_button'),
        onClick: openManagePermissions,
        'data-testid': 'actionManagePermissions',
      }}
    />
  );
};
