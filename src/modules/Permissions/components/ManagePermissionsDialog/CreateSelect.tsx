import { SelectOption } from '@app/modules/Permissions/components/ManagePermissionsDialog/select';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Select as PFSelect } from '@patternfly/react-core/dist/js/components/Select/Select';
import { SelectVariant } from '@patternfly/react-core';
import { SelectOption as PFSelectOption } from '@patternfly/react-core/dist/js/components/Select/SelectOption';
import { Validated } from '@app/modules/Permissions/components/ManagePermissionsDialog/validated';
import { FormGroupWithPopover } from '@app/components';
import {
  AclOperation,
  AclPatternType,
  AclPermissionType,
  AclResourceType,
} from '@rhoas/kafka-instance-sdk';

export type CreateSelectProps<T> = {
  id: string;
  options: SelectOption<T>[];
  selected: Validated<string | undefined>;
  setSelected: (row: number, id: T | undefined) => void;
  row: number;
};

export const CreateSelect = <
  T extends AclPermissionType | AclResourceType | AclPatternType | AclOperation
>({
  options,
  setSelected,
  selected,
  row,
  id,
}: CreateSelectProps<T>): React.ReactElement => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const clearSelection = () => {
    setSelected(row, undefined);
    setIsOpen(false);
  };

  const onSelect = (event, selection, isPlaceholder) => {
    if (isPlaceholder) clearSelection();
    else {
      setSelected(row, selection);
      setIsOpen(false);
    }
  };

  return (
    <FormGroupWithPopover
      labelHead={t(
        `permission.manage_permissions_dialog.create_permissions.${id}.popover_head`
      )}
      fieldId={id}
      labelBody={t(
        `permission.manage_permissions_dialog.create_permissions.${id}.popover_label`
      )}
      buttonAriaLabel={t(
        '`permission.manage_permissions_dialog.create_permissions.${id}.aria`'
      )}
      isRequired={true}
      helperTextInvalid={selected.errorMessage}
      validated={selected.invalid ? 'error' : undefined}
    >
      <PFSelect
        variant={SelectVariant.single}
        onToggle={onToggle}
        onSelect={onSelect}
        onClear={clearSelection}
        selections={selected.value}
        isOpen={isOpen}
        isInputValuePersisted={true}
        placeholderText={t(
          'permission.manage_permissions_dialog.create_permissions.placeholder'
        )}
      >
        {options.map((option, index) => (
          <PFSelectOption
            isDisabled={option.disabled}
            key={index}
            value={option.value}
            {...(option.description && { description: option.description })}
          >
            {option.title}
          </PFSelectOption>
        ))}
      </PFSelect>
    </FormGroupWithPopover>
  );
};
