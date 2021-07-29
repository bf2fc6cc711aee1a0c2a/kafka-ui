import React from 'react';
import { useTranslation } from 'react-i18next';
import { AllAccountsTable } from '@app/modules/Permissions/components/ManagePermissionsDialog/AllAccountsTable';
import { SelectedAccountTable } from '@app/modules/Permissions/components/ManagePermissionsDialog/SelectedAccountsTable';
import { EnhancedAclBinding } from '@app/services/acls';

export type EditExistingProps = {
  existingAcls: Array<EnhancedAclBinding>;
  selectedAccountId?: string;
};

export const EditExisting: React.FunctionComponent<EditExistingProps> = ({
  existingAcls,
  selectedAccountId,
}) => {
  const { t } = useTranslation();
  const existingAclsForAllPrincipals = existingAcls.filter(
    (i) => i.principal === 'User:*'
  );
  const existingAclsForSelectedPrincipal = existingAcls.filter(
    (i) => i.principal === `User:${selectedAccountId}`
  );

  return (
    <>
      <h2>{t('permission.manage_permissions_dialog.edit_existing.title')}</h2>
      <AllAccountsTable existingAcls={existingAclsForAllPrincipals} />
      <SelectedAccountTable
        existingAcls={existingAclsForSelectedPrincipal}
        selectedAccountId={selectedAccountId}
      />
    </>
  );
};
