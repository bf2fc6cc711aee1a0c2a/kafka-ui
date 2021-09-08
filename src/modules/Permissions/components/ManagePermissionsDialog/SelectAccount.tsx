import React, { useState } from 'react';
import { Principal } from '@bf2/ui-shared';
import { useTranslation } from 'react-i18next';
import { sentenceCase } from 'sentence-case';
import { FormGroupWithPopover } from '@app/components';
import { Select as PFSelect } from '@patternfly/react-core/dist/js/components/Select/Select';
import { SelectVariant } from '@patternfly/react-core';
import { SelectOption as PFSelectOption } from '@patternfly/react-core/dist/js/components/Select/SelectOption';
import { SelectOption } from '@app/modules/Permissions/components/ManagePermissionsDialog/select';
import { Validated } from '@app/modules/Permissions/components/ManagePermissionsDialog/validated';

export type SelectAccountProps = {
  id: Validated<string | undefined>;
  setId: React.Dispatch<React.SetStateAction<Validated<string | undefined>>>;
  initialOptions: Principal[];
};

export const SelectAccount: React.FunctionComponent<SelectAccountProps> = ({
  setId,
  id,
  initialOptions,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<SelectOption<string>[]>(
    initialOptions.map((o) => {
      return {
        value: o.id,
        title: o.id,
        description: `${sentenceCase(o.principalType.toString())} ${
          o.displayName || ''
        }`,
      } as SelectOption<string>;
    })
  );

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const clearSelection = () => {
    setId({ value: undefined });
    setIsOpen(false);
  };

  const onSelect = (event, selection, isPlaceholder) => {
    if (isPlaceholder) clearSelection();
    else {
      setId({ value: selection });
      setIsOpen(false);
    }
  };

  const onCreateOption = (newValue: string) => {
    setOptions([...options, { value: newValue } as SelectOption<string>]);
  };

  return (
    <FormGroupWithPopover
      labelHead={t('permission.manage_permissions_dialog.account_id_title')}
      fieldId='kafka-instance-name'
      fieldLabel={t('permission.manage_permissions_dialog.account_id_title')}
      labelBody={t('permission.manage_permissions_dialog.account_id_help')}
      buttonAriaLabel={t(
        'permission.manage_permissions_dialog.account_id_aria'
      )}
      isRequired={true}
      helperTextInvalid={id.errorMessage}
      validated={id.invalid ? 'error' : undefined}
    >
      <PFSelect
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel={t(
          'permission.manage_permissions_dialog.account_id_typeahead_aria'
        )}
        onToggle={onToggle}
        onSelect={onSelect}
        onClear={clearSelection}
        selections={id.value}
        isOpen={isOpen}
        isInputValuePersisted={true}
        placeholderText={t(
          'permission.manage_permissions_dialog.account_id_typeahead_placeholder'
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
