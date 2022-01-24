import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectOption } from '@app/modules/Permissions/components/ManagePermissionsDialog/select';
import {
  SelectVariant,
  ValidatedOptions,
  Select as PFSelect,
  SelectOption as PFSelectOption,
} from '@patternfly/react-core';
import { Validated } from '@app/modules/Permissions/components/ManagePermissionsDialog/validated';
import { FormGroupWithPopover } from '@app/components';

export type CreateTypeaheadProps = {
  row: number;
  childRow?: number;
  value: Validated<string | undefined>;
  setValue: (row: number, id: string | undefined, childRow?: number) => void;
  initialOptions: () => string[];
  id: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  setEscapeClosesModal: (closes: boolean) => void;
  menuAppendTo:
    | HTMLElement
    | (() => HTMLElement)
    | 'parent'
    | 'inline'
    | undefined;
};

export const CreateTypeahead: React.VFC<CreateTypeaheadProps> = ({
  row,
  setValue,
  value,
  initialOptions,
  id,
  placeholder,
  onSelect,
  setEscapeClosesModal,
  menuAppendTo,
  childRow,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<SelectOption<string>[]>([]);

  useEffect(() => {
    setOptions(
      initialOptions().map((o) => {
        return { value: o } as SelectOption<string>;
      })
    );
  }, [initialOptions]);

  const onToggle = (newState) => {
    if (newState) {
      setEscapeClosesModal(false);
    } else {
      setEscapeClosesModal(true);
    }
    setIsOpen(newState);
  };

  const clearSelection = () => {
    setValue(row, undefined, childRow);
    setIsOpen(false);
  };

  const select = (event, selection, isPlaceholder) => {
    if (selection === '') selection = undefined;
    if (isPlaceholder) clearSelection();
    else {
      setValue(row, selection, childRow);
      setIsOpen(false);
      onSelect(selection);
    }
  };

  const onCreateOption = (newValue: string) => {
    setOptions([...options, { value: newValue } as SelectOption<string>]);
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
      helperTextInvalid={value.errorMessage}
      validated={value.validated || ValidatedOptions.default}
    >
      <PFSelect
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel={t(
          'permission.manage_permissions_dialog.assign_permissions.resource_name_aria'
        )}
        onToggle={onToggle}
        className='pf-u-pr-lg-on-lg'
        onSelect={select}
        onClear={clearSelection}
        selections={value.value}
        isOpen={isOpen}
        isInputValuePersisted={true}
        placeholderText={placeholder}
        isCreatable={true}
        onCreateOption={onCreateOption}
        createText={t(
          'permission.manage_permissions_dialog.assign_permissions.resource_name_typeahead_create_text'
        )}
        validated={value.validated || ValidatedOptions.default}
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
          />
        ))}
      </PFSelect>
    </FormGroupWithPopover>
  );
};
