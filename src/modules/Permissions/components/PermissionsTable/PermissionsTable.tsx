import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaginationVariant } from '@patternfly/react-core';
import {
  IActionsResolver,
  ICell,
  OnSelect,
  TableVariant,
} from '@patternfly/react-table';
import { MASPagination, MASTable, ModalType, useModal } from '@app/components';
import { PermissionsToolbar } from './PermissionsToolbar';
import {
  AclFilter,
  convertEnum,
  EnhancedAclBinding,
  EnhancedAclBindingListPage,
  PermissionsService,
} from '@app/services/acls';
import { useTimeout } from '@app/hooks';
import {
  operationCell,
  permissionCell,
  principalCell,
  resourceCell,
} from '@app/modules/Permissions/components/PermissionsTable/Cells';
import { PermissionsTableEmptyState } from '@app/modules/Permissions/components/PermissionsTable/PermissionsTableEmptyState';
import {
  AclOperationFilter,
  AclPatternTypeFilter,
  AclPermissionTypeFilter,
  AclResourceTypeFilter,
} from '@rhoas/kafka-instance-sdk';

export type PermissionsTableProps = {
  permissionsService: PermissionsService;
  kafkaName?: string;
  topicNames: string[];
  consumerGroupIds: string[];
};

const PermissionsTable: React.FC<PermissionsTableProps> = ({
  permissionsService,
  kafkaName,
  topicNames,
  consumerGroupIds,
}) => {
  type SelectableEnhancedAclBinding = EnhancedAclBinding & {
    selected: boolean;
  };

  type SelectableEnhancedAclBindingListPage = Omit<
    EnhancedAclBindingListPage,
    'items'
  > & {
    items?: SelectableEnhancedAclBinding[];
  };

  const { t } = useTranslation();
  const [filteredValue, setFilteredValue] = useState<string>('');
  const { showModal } = useModal<ModalType.ManagePermissions>() || {};
  const [aclPage, setAclPage] = useState<
    SelectableEnhancedAclBindingListPage | undefined
  >();

  const fetchPermissions = async () => {
    try {
      const response = await permissionsService.getPermissions({
        resourceName: filteredValue !== '' ? filteredValue : undefined,
      } as AclFilter);
      setAclPage((prevState) => {
        return {
          items: response.items?.map((value) => {
            const found = prevState?.items?.filter(
              (p) => p.hash() === value.hash()
            );
            const selected =
              (found?.length !== 0 && found?.every((p) => p.selected)) || false;
            return {
              selected,
              ...value,
            };
          }),
          page: response.page,
          size: response.size,
          total: response.total,
        };
      });
    } catch (err) {
      //addAlert(err.response.data.error_message, AlertVariant.danger);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  useTimeout(() => fetchPermissions(), 5000);

  const tableColumns = [
    { title: '' },
    { title: '' },
    { title: '' },
    { title: '' },
  ] as ICell[];

  const cells = [principalCell, permissionCell, operationCell, resourceCell];

  const onSelect: OnSelect = (event, isSelected, rowIndex) => {
    if (rowIndex === -1) {
      setAclPage((prevState) => {
        if (prevState) {
          return {
            items: prevState?.items?.map((p) => {
              p.selected = isSelected;
              return p;
            }),
            ...prevState,
          };
        }
      });
    } else {
      setAclPage((prevState) => {
        if (prevState) {
          const items = prevState?.items;
          if (items !== undefined) {
            items[rowIndex].selected = isSelected;
          }
          return {
            items,
            ...prevState,
          };
        }
      });
    }
  };

  const openManagePermissions = (selectedAccountId?: string) => {
    const onSave = async () => {
      await fetchPermissions();
    };

    showModal &&
      showModal(ModalType.ManagePermissions, {
        selectedAccountId,
        kafkaName,
        acls: aclPage?.items || [],
        topicNames,
        consumerGroupIds,
        onSave,
      });
  };

  const onDeleteSelected = () => {
    aclPage?.items
      ?.filter((item) => item.selected)
      .forEach((value) => {
        permissionsService.deletePermission({
          resourceName: value.resourceName,
          patternType: convertEnum(value.patternType, AclPatternTypeFilter),
          permissionType: convertEnum(
            value.permission,
            AclPermissionTypeFilter
          ),
          resourceType: convertEnum(value.resourceType, AclResourceTypeFilter),
          operation: convertEnum(value.operation, AclOperationFilter),
          principal: value.principal,
        });
      });
  };

  const onDelete = (rowIndex?: number) => {
    if (rowIndex !== undefined && aclPage?.items !== undefined) {
      const value = aclPage.items[rowIndex];
      permissionsService.deletePermission({
        resourceName: value.resourceName,
        patternType: convertEnum(value.patternType, AclPatternTypeFilter),
        permissionType: convertEnum(value.permission, AclPermissionTypeFilter),
        resourceType: convertEnum(value.resourceType, AclResourceTypeFilter),
        operation: convertEnum(value.operation, AclOperationFilter),
        principal: value.principal,
      });
    }
  };

  const actionResolver: IActionsResolver = (_, { rowIndex }) => {
    const resolver = [
      {
        title: t('permission.table.row_kebab.manage'),
        ['data-testid']: 'permission-table-row-manage',
        onClick: () => {
          if (aclPage?.items !== undefined && rowIndex !== undefined) {
            openManagePermissions(aclPage.items[rowIndex].principalDisplay);
          }
        },
      },
      {
        title: t('permission.table.row_kebab.delete'),
        ['data-testid']: 'permission-table-row-delete',
        onClick: () => onDelete(rowIndex),
      },
    ];
    return resolver;
  };

  if (
    aclPage === undefined ||
    aclPage.items === undefined ||
    aclPage.items.length === 0
  ) {
    return <PermissionsTableEmptyState />;
  }

  return (
    <>
      <PermissionsToolbar
        total={aclPage.total || 0}
        page={aclPage.page || 1}
        perPage={aclPage.size || 10}
        openManagePermissions={() => openManagePermissions()}
        setFilteredValue={setFilteredValue}
        filteredValue={filteredValue}
        deletedSelectedEnabled={aclPage.items.some((item) => item.selected)}
        onDeleteSelected={onDeleteSelected}
      />
      <MASTable
        tableProps={{
          cells: tableColumns,
          rows: aclPage.items.map((item, row) => {
            return {
              cells: cells.map((f) => f(item, row)),
              selected: item.selected,
              originalData: item,
            };
          }),
          'aria-label': t('permission.table.permission_list_table'),
          shouldDefaultCustomRowWrapper: true,
          variant: TableVariant.compact,
          onSelect,
          actionResolver,
          canSelectAll: false,
        }}
        rowDataTestId={'tablePermissions-row'}
      />
      <MASPagination
        widgetId='permissions-pagination-options-menu-bottom'
        itemCount={aclPage.total || 0}
        variant={PaginationVariant.bottom}
        page={aclPage.page}
        perPage={aclPage.size}
        titles={{
          paginationTitle: t('common.full_pagination'),
          perPageSuffix: t('common.per_page_suffix'),
          toFirstPage: t('common.to_first_page'),
          toPreviousPage: t('common.to_previous_page'),
          toLastPage: t('common.to_last_page'),
          toNextPage: t('common.to_next_page'),
          optionsToggle: t('common.options_toggle'),
          currPage: t('common.curr_page'),
        }}
      />
    </>
  );
};
export { PermissionsTable };