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
import { ValidatedOptions } from '@patternfly/react-core';

export type CreateSelectProps<T> = {
  id: string;
  options: SelectOption<T>[];
  selected: Validated<string | undefined>;
  setSelected: (row: number, id: T | undefined, childRow?: number) => void;
  row: number;
  childRow?: number;
  placeholder?: string;
  setEscapeClosesModal: (closes: boolean) => void;
  onSelect: (value: string) => void;
  menuAppendTo:
    | HTMLElement
    | (() => HTMLElement)
    | 'parent'
    | 'inline'
    | undefined;
  onClear: () => T | undefined;
};

export const CreateSelect = <
  T extends AclPermissionType | AclResourceType | AclPatternType | AclOperation
>({
  options,
  setSelected,
  selected,
  row,
  id,
  placeholder,
  setEscapeClosesModal,
  onSelect,
  menuAppendTo,
  onClear,
  childRow,
}: CreateSelectProps<T>): React.ReactElement => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onToggle = (newState) => {
    if (newState) {
      setEscapeClosesModal(false);
    } else {
      setEscapeClosesModal(true);
    }
    setIsOpen(newState);
  };

  const clearSelection = () => {
    setSelected(row, onClear(), childRow);
    setIsOpen(false);
  };

  const select = (event, selection, isPlaceholder) => {
    if (selection === '') selection = undefined;
    if (isPlaceholder) clearSelection();
    else {
      setSelected(row, selection, childRow);
      setIsOpen(false);
      onSelect(selection);
    }
  };

  return (
    <FormGroupWithPopover
      labelHead={t(
        `permission.manage_permissions_dialog.assign_permissions.${id}.popover_head`
      )}
      fieldId={id}
      labelBody={t(
        `permission.manage_permissions_dialog.assign_permissions.${id}.popover_label`
      )}
      buttonAriaLabel={t(
        '`permission.manage_permissions_dialog.assign_permissions.${id}.aria`'
      )}
      isRequired={true}
      helperTextInvalid={selected.errorMessage}
      validated={selected.validated || ValidatedOptions.default}
    >
      <PFSelect
        variant={SelectVariant.single}
        onToggle={onToggle}
        onSelect={select}
        selections={selected.value}
        isOpen={isOpen}
        isInputValuePersisted={true}
        placeholderText={placeholder}
        validated={selected.validated || ValidatedOptions.default}
        menuAppendTo={menuAppendTo}
        maxHeight={200}
        direction={'up'}
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
