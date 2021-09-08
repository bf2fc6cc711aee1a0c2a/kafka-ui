import { EnhancedAclBinding } from '@app/services/acls';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CellBuilder,
  operationCell,
  permissionCell,
  resourceCell,
} from '@app/modules/Permissions/components/PermissionsTable/Cells';
import { Button, FormGroup, GridItem } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';
import { ICell, TableVariant } from '@patternfly/react-table';
import { MASTable } from '@app/components';

export type SelectedAccountTableProps = {
  existingAcls: Array<EnhancedAclBinding>;
  selectedAccountId?: string;
};

export const SelectedAccountTable: React.FunctionComponent<SelectedAccountTableProps> =
  ({ existingAcls, selectedAccountId }) => {
    type RemovableEnhancedAclBinding = EnhancedAclBinding & {
      removed: boolean;
      index: number;
    };

    const { t } = useTranslation();
    const [acls, setAcls] = useState<RemovableEnhancedAclBinding[]>([]);

    useEffect(() => {
      // Workaround as I can't work out how to pass initial state for an array
      setAcls(
        existingAcls.map((v, k) => {
          const answer = v as RemovableEnhancedAclBinding;
          answer.index = k;
          return answer;
        })
      );
    }, [existingAcls]);

    const removeRow = (acl: RemovableEnhancedAclBinding) => {
      setAcls(
        acls.map((v) => {
          if (v.hash() === acl.hash()) {
            v.removed = true;
          }
          return v;
        })
      );
    };

    const removeCell: CellBuilder<RemovableEnhancedAclBinding> = (item) => {
      return {
        title: (
          <Button
            variant='link'
            icon={<MinusCircleIcon />}
            onClick={() => removeRow(item)}
          >
            Remove
          </Button>
        ),
      };
    };

    const tableColumns = [
      { title: '' },
      { title: '' },
      { title: '' },
      { title: '' },
    ] as ICell[];
    const cells = [operationCell, permissionCell, resourceCell, removeCell];

    if (acls.length === 0 || selectedAccountId === undefined) {
      return <></>;
    }

    return (
      <GridItem span={12}>
        <FormGroup
          fieldId='selectedAccount'
          label={selectedAccountId}
          helperText={t(
            'permission.manage_permissions_dialog.edit_existing.selected_account_help'
          )}
          isHelperTextBeforeField={true}
        >
          <MASTable
            tableProps={{
              cells: tableColumns,
              rows: acls
                .filter((acl) => !acl.removed)
                .map((item, row) => {
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
