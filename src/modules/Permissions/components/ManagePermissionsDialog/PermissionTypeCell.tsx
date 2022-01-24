import React from 'react';
import { useTranslation } from 'react-i18next';
import { ValidatedOptions, LabelGroup, Label } from '@patternfly/react-core';
import { sentenceCase } from 'sentence-case';

import { AclPermissionType } from '@rhoas/kafka-instance-sdk';

import {
  createEmptyNewAcl,
  update2DArrayAcls,
  handle2DArrayAcls,
  AclCellProps,
} from './acls';
import { CreateSelect } from './CreateSelect';
import { getPermissionsTypes } from '@app/services/acls';
import { SelectOption } from '@app/modules/Permissions/components/ManagePermissionsDialog/select';

type PermissionTypeCellProps = AclCellProps;

const PermissionTypeCell: React.VFC<PermissionTypeCellProps> = ({
  acl,
  row,
  childRow = 0,
  setAcls,
  setEscapeClosesModal,
  menuAppendTo,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  const setPermissionType = (
    row: number,
    value?: AclPermissionType,
    childRow?: number
  ) => {
    setAcls((prevState) =>
      prevState.map((v, k) => {
        if (k === row) {
          if (Array.isArray(v) && childRow !== undefined)
            v[childRow].permission = { value };
          else v.permission = { value };
        }
        return v;
      })
    );
  };

  if (acl.aclShortcutType) {
    return (
      <>
        {Array.isArray(acl?.operations) && (
          <LabelGroup numLabels={4}>
            <Label
              variant='outline'
              color={
                acl.permission.value === AclPermissionType.Deny
                  ? 'red'
                  : undefined
              }
            >
              {sentenceCase(acl.permission.value || '')}
            </Label>
            {acl?.operations?.map((operation) => (
              <Label variant='outline' key={operation}>
                {sentenceCase(operation)}
              </Label>
            ))}
          </LabelGroup>
        )}
      </>
    );
  }

  return (
    <CreateSelect
      options={getPermissionsTypes().map((value) => {
        return {
          value,
          title: sentenceCase(value),
        } as SelectOption<AclPermissionType>;
      })}
      selected={acl.permission}
      setSelected={setPermissionType}
      row={row}
      id='permission-type'
      setEscapeClosesModal={setEscapeClosesModal}
      menuAppendTo={menuAppendTo}
      onClear={() => createEmptyNewAcl().permission.value}
      onSelect={(value) => {
        setAcls((prevState) => {
          const newPrevState = handle2DArrayAcls(prevState, row, childRow);
          if (value === undefined) {
            newPrevState.permission.validated = ValidatedOptions.error;
            newPrevState.permission.errorMessage = t(
              'permission.manage_permissions_dialog.assign_permissions.must_select_permission_error'
            );
          } else {
            newPrevState.permission.validated = ValidatedOptions.default;
          }
          return update2DArrayAcls(prevState, newPrevState, row, childRow);
        });
      }}
    />
  );
};

export { PermissionTypeCell };
