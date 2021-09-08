import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dropdown,
  DropdownItem,
  KebabToggle,
} from '@patternfly/react-core';
import { MASPagination, MASToolbar, ToolbarItemProps } from '@app/components';

type PermissionsToolbarKebabProps = {
  onDeleteSelected: () => void;
  deleteSelectedEnabled: boolean;
};

const PermissionsToolbarKebab: React.FunctionComponent<PermissionsToolbarKebabProps> =
  ({ deleteSelectedEnabled, onDeleteSelected }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const onToggle = (v) => {
      setIsOpen(v);
    };

    const onSelect = () => {
      setIsOpen((prevState) => !prevState);
      onFocus();
    };

    const onFocus = () => {
      const element = document.getElementById(
        'permissions-toolbar-kebab-toggle'
      );
      element?.focus();
    };

    const dropdownItems = [
      <DropdownItem
        key='delete_selected'
        onClick={onDeleteSelected}
        isDisabled={!deleteSelectedEnabled}
      >
        {t('permission.table.delete_selected')}
      </DropdownItem>,
    ];
    return (
      <Dropdown
        onSelect={onSelect}
        toggle={
          <KebabToggle
            onToggle={onToggle}
            id='permissions-toolbar-kebab-toggle'
          />
        }
        isOpen={isOpen}
        isPlain
        dropdownItems={dropdownItems}
      />
    );
  };

export type PermissionsToolbarProps = {
  total: number;
  page: number;
  perPage: number;
  setFilteredValue: (value: string) => void;
  filteredValue: string;
  openManagePermissions?: () => void;
  onDeleteSelected: () => void;
  deletedSelectedEnabled: boolean;
};

const PermissionsToolbar: React.FC<PermissionsToolbarProps> = ({
  total = 0,
  page,
  perPage,
  setFilteredValue,
  openManagePermissions,
  onDeleteSelected,
  deletedSelectedEnabled,
}) => {
  const { t } = useTranslation();

  const onClear = () => {
    setFilteredValue('');
  };

  const toggleGroupItems = <></>;

  const toolbarItems: ToolbarItemProps[] = [
    {
      item: (
        <Button
          id='permissions-toolbar-manage-permissions-button'
          data-testid='actionManagePermissions'
          onClick={openManagePermissions}
        >
          {t('permission.table.manage_button')}
        </Button>
      ),
    },
    {
      item: (
        <PermissionsToolbarKebab
          deleteSelectedEnabled={deletedSelectedEnabled}
          onDeleteSelected={onDeleteSelected}
        />
      ),
    },
  ];

  if (total > 0) {
    toolbarItems.push({
      item: (
        <MASPagination
          widgetId='permissions-pagination-options-menu-top'
          itemCount={total}
          page={page}
          perPage={perPage}
          titles={{
            paginationTitle: t('common.minimal_pagination'),
            perPageSuffix: t('common.per_page_suffix'),
            toFirstPage: t('common.to_first_page'),
            toPreviousPage: t('common.to_previous_page'),
            toLastPage: t('common.to_last_page'),
            toNextPage: t('common.to_next_page'),
            optionsToggle: t('common.options_toggle'),
            currPage: t('common.curr_page'),
          }}
          isCompact={true}
        />
      ),
      variant: 'pagination',
      alignment: { default: 'alignRight' },
    });
  }

  return (
    <MASToolbar
      toolbarProps={{
        id: 'instance-toolbar',
        clearAllFilters: onClear,
        collapseListedFiltersBreakpoint: 'md',
        inset: { xl: 'insetLg' },
      }}
      toggleGroupProps={{ toggleIcon: '', breakpoint: 'md' }}
      toggleGroupItems={toggleGroupItems}
      toolbarItems={toolbarItems}
    />
  );
};

export { PermissionsToolbar };
