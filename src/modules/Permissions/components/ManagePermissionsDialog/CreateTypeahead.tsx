import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectOption } from '@app/modules/Permissions/components/ManagePermissionsDialog/select';
import { Select as PFSelect } from '@patternfly/react-core/dist/js/components/Select/Select';
import { SelectVariant } from '@patternfly/react-core';
import { SelectOption as PFSelectOption } from '@patternfly/react-core/dist/js/components/Select/SelectOption';
import { Validated } from '@app/modules/Permissions/components/ManagePermissionsDialog/validated';
import { FormGroupWithPopover } from '@app/components';

export type CreateTypeaheadProps = {
  row: number;
  value: Validated<string | undefined>;
  setValue: (row: number, id: string | undefined) => void;
  initialOptions: () => string[];
  id: string;
};

export const CreateTypeahead: React.FunctionComponent<CreateTypeaheadProps> = ({
  row,
  setValue,
  value,
  initialOptions,
  id,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<SelectOption<string>[]>([]);

  useEffect(() => {
    setOptions(
      initialOptions().map((o) => {
        return { value: o } as SelectOption<string>;
      })
    );
  }, [initialOptions]);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const clearSelection = () => {
    setValue(row, undefined);
    setIsOpen(false);
  };

  const onSelect = (event, selection, isPlaceholder) => {
    if (isPlaceholder) clearSelection();
    else {
      setValue(row, selection);
      setIsOpen(false);
    }
  };

  const onCreateOption = (newValue: string) => {
    setOptions([...options, { value: newValue } as SelectOption<string>]);
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
      helperTextInvalid={value.errorMessage}
      validated={value.invalid ? 'error' : undefined}
    >
      <PFSelect
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel={t(
          'permission.manage_permissions_dialog.create_permissions.resource_name_aria'
        )}
        onToggle={onToggle}
        onSelect={onSelect}
        onClear={clearSelection}
        selections={value.value}
        isOpen={isOpen}
        isInputValuePersisted={true}
        placeholderText={t(
          'permission.manage_permissions_dialog.create_permissions.resource_name_typeahead_placeholder'
        )}
        isCreatable={true}
        onCreateOption={onCreateOption}
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
