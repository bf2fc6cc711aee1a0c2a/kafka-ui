import React from 'react';
import { ICell, TableVariant } from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';
import {
  operationCell,
  permissionCell,
  resourceCell,
} from '@app/modules/Permissions/components/PermissionsTable/Cells';
import { FormGroup, GridItem } from '@patternfly/react-core';
import { MASTable } from '@app/components';
import { EnhancedAclBinding } from '@app/services/acls';

type AllAccountsTableProps = {
  existingAcls: Array<EnhancedAclBinding>;
};

export const AllAccountsTable: React.FunctionComponent<AllAccountsTableProps> =
  ({ existingAcls }) => {
    const tableColumns = [
      { title: '' },
      { title: '' },
      { title: '' },
      { title: '' },
    ] as ICell[];
    const { t } = useTranslation();
    if (existingAcls.length === 0) {
      return <></>;
    }
    const cells = [operationCell, permissionCell, resourceCell];
    return (
      <GridItem span={12}>
        <FormGroup
          fieldId='allAccounts'
          label={t(
            'permission.manage_permissions_dialog.edit_existing.all_accounts_title'
          )}
          helperText={t(
            'permission.manage_permissions_dialog.edit_existing.all_accounts_help'
          )}
          isHelperTextBeforeField={true}
        >
          <MASTable
            tableProps={{
              cells: tableColumns,
              rows: existingAcls.map((item, row) => {
                return {
                  cells: cells.map((f) => f(item, row)),
                  originalData: item,
                };
              }),
              'aria-label': t('permission.table.table.permission_list_table'),
              shouldDefaultCustomRowWrapper: true,
              variant: TableVariant.compact,
              canSelectAll: false,
            }}
            rowDataTestId={'tablePermissions-row'}
          />
        </FormGroup>
      </GridItem>
    );
  };
