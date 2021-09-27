import { EnhancedAclBinding } from '@app/services/acls';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  CellBuilder,
  permissionOperationCell,
  resourceCell,
} from '@app/modules/Permissions/components/PermissionsTable/Cells';
import { Button, FormGroup, GridItem, Label } from '@patternfly/react-core';
import { TrashIcon } from '@patternfly/react-icons';
import { cellWidth, ICell, TableVariant } from '@patternfly/react-table';
import { MASTable } from '@app/components';

export type ExistingAclTableProps = {
  existingAcls: Array<EnhancedAclBinding>;
  selectedAccountId?: string;
  onRemove: (acl: EnhancedAclBinding) => void;
};

export const ExistingAclTable: React.FunctionComponent<ExistingAclTableProps> =
  ({ existingAcls, selectedAccountId, onRemove }) => {
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
      onRemove(acl);
    };

    const tableColumns = [
      {
        title: t('permission.table.resource_column_title'),
        columnTransforms: [cellWidth(60)],
      },
      {
        title: t('permission.table.permissions_column_title'),
        columnTransforms: [cellWidth(20)],
      },
      {
        title: '',
        columnTransforms: [cellWidth(20)],
      },
    ] as ICell[];

    const principalCell: CellBuilder<RemovableEnhancedAclBinding> = (item) => {
      const RemoveButton: React.FunctionComponent = () => (
        <Button
          variant='link'
          icon={<TrashIcon />}
          onClick={() => removeRow(item)}
        />
      );

      const AllAccountsLabel: React.FunctionComponent = () => (
        <Label variant='outline'>{t('permission.table.all_accounts')}</Label>
      );

      if (selectedAccountId === '*' && item.principal === '*') {
        return {
          title: (
            <div className='pf-u-display-flex pf-u-justify-content-space-between pf-u-justify-content-flex-end-on-lg'>
              <AllAccountsLabel /> <RemoveButton />
            </div>
          ),
          props: {},
        };
      } else if (item.principal === '*') {
        return {
          title: (
            <div className='pf-u-display-flex pf-u-justify-content-flex-end-on-lg'>
              <AllAccountsLabel />
            </div>
          ),
          props: {},
        };
      } else {
        return {
          title: (
            <div className='pf-u-display-flex pf-u-justify-content-flex-end'>
              <RemoveButton />
            </div>
          ),
          props: {},
        };
      }
    };

    const cells = [resourceCell, permissionOperationCell, principalCell];

    if (selectedAccountId === undefined || acls.length === 0) {
      return <></>;
    }

    const HelperText: React.FunctionComponent = () => {
      if (selectedAccountId === '*') {
        return t(
          'permission.manage_permissions_dialog.edit_existing.all_accounts_help'
        );
      }
      return (
        <Trans i18nKey='permission.manage_permissions_dialog.edit_existing.help'>
          Review the list of existing permissions for the selected account. The
          list includes account-specific permissions and permissions applied to
          all accounts within this Kafka instance. Permissions labeled{' '}
          <strong>All accounts</strong> cannot be removed when an individual
          account ID is selected.
        </Trans>
      );
    };

    return (
      <GridItem span={12}>
        <FormGroup
          fieldId='selectedAccount'
          label={t('permission.manage_permissions_dialog.edit_existing.title')}
          helperText={<HelperText />}
          isHelperTextBeforeField={true}
        >
          <MASTable
            tableProps={{
              cells: tableColumns,
              rows: [
                ...acls
                  .filter((acl) => !acl.removed)
                  .map((item, row) => {
                    return {
                      cells: cells.map((f) => f(item, row)),
                      originalData: item,
                    };
                  }),
              ],
              'aria-label': t('permission.table.table.permission_list_table'),
              shouldDefaultCustomRowWrapper: true,
              variant: TableVariant.compact,
              canSelectAll: false,
              // TODO: gridBreakPoint: 'grid-lg' NOTE: This is needed so that the table doesn't overrun a narrow screen, but it currently breaks the first header because it's messing with :before of the first cell and so is the mas--[streams-]table-view__table
            }}
            rowDataTestId={'tablePermissions-row'}
          />
        </FormGroup>
      </GridItem>
    );
  };
