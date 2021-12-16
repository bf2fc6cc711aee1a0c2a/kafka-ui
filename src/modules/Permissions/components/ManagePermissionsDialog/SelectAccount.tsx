import React, { useState } from 'react';
import { Principal, PrincipalType } from '@rhoas/app-services-ui-shared';
import { useTranslation } from 'react-i18next';
import { FormGroupWithPopover } from '@app/components';
import {
  Divider,
  Select,
  SelectGroup,
  SelectOption,
  SelectVariant,
  ValidatedOptions,
} from '@patternfly/react-core';
import { Validated } from '@app/modules/Permissions/components/ManagePermissionsDialog/validated';

export type SelectAccountProps = {
  id: Validated<string | undefined>;
  setId: React.Dispatch<React.SetStateAction<Validated<string | undefined>>>;
  initialOptions: Principal[];
  setEscapeClosesModal: (closes: boolean) => void;
};

export const SelectAccount: React.FunctionComponent<SelectAccountProps> = ({
  setId,
  id,
  initialOptions,
  setEscapeClosesModal,
}) => {
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
    setId({ value: undefined, validated: undefined });
    setIsOpen(false);
  };

  const onSelect = (event, selection, isPlaceholder) => {
    if (selection === '') selection = undefined;
    if (isPlaceholder) {
      clearSelection();
    } else {
      setId(() => {
        if (selection === undefined) {
          return {
            value: selection,
            validated: ValidatedOptions.error,
            errorMessage: t(
              'permission.manage_permissions_dialog.must_select_account_error'
            ),
          };
        } else {
          return {
            validated: ValidatedOptions.default,
            value: selection,
          };
        }
      });
    }
    setIsOpen(false);
  };

  const options = [
    <SelectGroup key='all_accounts_group'>
      <SelectOption
        key='*'
        value='*'
        description={t(
          'permission.manage_permissions_dialog.all_accounts_description'
        )}
      >
        {t('permission.manage_permissions_dialog.all_accounts_title')}
      </SelectOption>
    </SelectGroup>,
    <Divider key='divider' />,
    <SelectGroup
      label={t(
        'permission.manage_permissions_dialog.all_accounts_service_account_group'
      )}
      key='service_accounts_group'
    >
      {initialOptions
        .filter(
          (principal) =>
            principal.principalType === PrincipalType.ServiceAccount
        )
        .sort((a, b) =>
          a.displayName && b.displayName
            ? a.displayName.localeCompare(b.displayName)
            : -1
        )
        .map((principal, index) => (
          <SelectOption
            key={index}
            value={principal.id}
            description={principal.displayName}
          >
            {principal.id}
          </SelectOption>
        ))}
    </SelectGroup>,
    <Divider key='divider' />,
    <SelectGroup
      label={t(
        'permission.manage_permissions_dialog.all_accounts_user_account_group'
      )}
      key='user_accounts_group'
    >
      {initialOptions
        .filter(
          (principal) => principal.principalType === PrincipalType.UserAccount
        )
        .map((principal, index) => (
          <SelectOption
            key={index}
            value={principal.id}
            description={principal.displayName}
          >
            {principal.id}
          </SelectOption>
        ))}
    </SelectGroup>,
  ];

  const customFilter = (_, value: string) => {
    if (!value) {
      return options;
    }

    const input = new RegExp(value, 'i');
    return options
      .filter((accounts) => Array.isArray(accounts.props.children))
      .map((account) =>
        account.props.children.filter(
          (allAccounts) =>
            input.test(allAccounts.props.value) ||
            input.test(allAccounts.props.description)
        )
      );
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
      validated={id.validated || ValidatedOptions.default}
    >
      <Select
        variant={SelectVariant.typeahead}
        className='kafka-ui--select--limit-height'
        typeAheadAriaLabel={t(
          'permission.manage_permissions_dialog.account_id_typeahead_aria'
        )}
        onToggle={onToggle}
        onSelect={onSelect}
        onClear={clearSelection}
        selections={id.value}
        onFilter={customFilter}
        isOpen={isOpen}
        isInputValuePersisted={true}
        placeholderText={t(
          'permission.manage_permissions_dialog.account_id_typeahead_placeholder'
        )}
        isCreatable={false}
        menuAppendTo='parent'
        validated={id.validated || ValidatedOptions.default}
        isGrouped={true}
      >
        {options}
      </Select>
    </FormGroupWithPopover>
  );
};
