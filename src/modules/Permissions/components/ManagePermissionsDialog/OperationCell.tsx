import React from 'react';
import { useTranslation } from 'react-i18next';
import { ValidatedOptions } from '@patternfly/react-core';
import { sentenceCase } from 'sentence-case';
import { snakeCase } from 'snake-case';

import { AclOperation } from '@rhoas/kafka-instance-sdk';
import {
  createEmptyNewAcl,
  update2DArrayAcls,
  handle2DArrayAcls,
  AclCellProps,
} from './acls';
import { CreateSelect } from './CreateSelect';
import { getOperations } from '@app/services/acls';
import { SelectOption } from '@app/modules/Permissions/components/ManagePermissionsDialog/select';

type OperationCellProps = AclCellProps & {
  resourceOperations: { [key: string]: Array<string> };
};

const OperationCell: React.FunctionComponent<OperationCellProps> = ({
  acl,
  row,
  childRow = 0,
  setAcls,
  setEscapeClosesModal,
  menuAppendTo,
  resourceOperations,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  const setOperation = (
    row: number,
    value?: AclOperation,
    childRow?: number
  ) => {
    setAcls((prevState) =>
      prevState.map((v, k) => {
        if (k === row) {
          if (Array.isArray(v) && childRow !== undefined)
            v[childRow].operation = { value };
          else v.operation = { value };
        }
        return v;
      })
    );
  };

  return (
    <CreateSelect
      options={getOperations()
        .filter((value) => {
          if (
            acl.resourceType.value === undefined ||
            acl.resourceType.value.toString() === ''
          ) {
            return true;
          }
          const resourceType = snakeCase(acl.resourceType.value.toString());
          const operationType = snakeCase(value);
          return resourceOperations[resourceType].some(
            (p) => p === operationType
          );
        })
        .map((value) => {
          return {
            value,
            title: sentenceCase(value),
          } as SelectOption<AclOperation>;
        })}
      selected={acl.operation}
      setSelected={setOperation}
      row={row}
      id='operation'
      placeholder={t(
        'permission.manage_permissions_dialog.assign_permissions.operation_placeholder'
      )}
      setEscapeClosesModal={setEscapeClosesModal}
      menuAppendTo={menuAppendTo}
      onClear={() => createEmptyNewAcl().operation.value}
      onSelect={(value) => {
        setAcls((prevState) => {
          const newPrevState = handle2DArrayAcls(prevState, row, childRow);
          if (value === undefined) {
            newPrevState.operation.validated = ValidatedOptions.error;
            newPrevState.operation.errorMessage = t(
              'permission.manage_permissions_dialog.assign_permissions.must_select_operation_error'
            );
          } else {
            newPrevState.operation.validated = ValidatedOptions.default;
          }
          return update2DArrayAcls(prevState, newPrevState, row, childRow);
        });
      }}
    />
  );
};

export { OperationCell };
