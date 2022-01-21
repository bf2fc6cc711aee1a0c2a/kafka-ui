import React from 'react';
import { useTranslation } from 'react-i18next';
import { ValidatedOptions } from '@patternfly/react-core';

import { AclPatternType, AclResourceType } from '@rhoas/kafka-instance-sdk';
import {
  AclShortcutType,
  createEmptyNewAcl,
  update2DArrayAcls,
  handle2DArrayAcls,
  AclCellProps,
} from './acls';
import { CreateSelect } from './CreateSelect';
import { getPatternTypes } from '@app/services/acls';
import { SelectOption } from '@app/modules/Permissions/components/ManagePermissionsDialog/select';

type PatternTypeCellProps = AclCellProps;

const PatternTypeCell: React.FC<PatternTypeCellProps> = ({
  acl,
  row,
  childRow = 0,
  setAcls,
  setEscapeClosesModal,
  menuAppendTo,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  if (
    acl.resourceType.value === AclResourceType.Cluster ||
    acl.aclShortcutType === AclShortcutType.ManageAccess
  ) {
    return <></>;
  }

  const setPatternType = (
    row: number,
    value?: AclPatternType,
    childRow?: number
  ) => {
    setAcls((prevState) =>
      prevState.map((v, k) => {
        if (k === row) {
          if (Array.isArray(v) && childRow !== undefined) {
            v[childRow].patternType = { value };
          } else {
            v.patternType = { value };
          }
        }
        return v;
      })
    );
  };

  return (
    <CreateSelect
      options={getPatternTypes()
        ?.map((value) => {
          return {
            value,
            title:
              value === AclPatternType.Prefixed
                ? t(
                    'permission.manage_permissions_dialog.assign_permissions.pattern_type_prefixed'
                  )
                : t(
                    'permission.manage_permissions_dialog.assign_permissions.pattern_type_literal'
                  ),
            description:
              value === AclPatternType.Prefixed
                ? t(
                    'permission.manage_permissions_dialog.assign_permissions.pattern_type_prefixed_help'
                  )
                : t(
                    'permission.manage_permissions_dialog.assign_permissions.pattern_type_literal_help'
                  ),
          } as SelectOption<AclPatternType>;
        })
        .sort((a, b) => b.value.localeCompare(a.value))}
      selected={acl.patternType}
      setSelected={setPatternType}
      row={row}
      childRow={childRow}
      id='pattern-type'
      setEscapeClosesModal={setEscapeClosesModal}
      menuAppendTo={menuAppendTo}
      onClear={() => createEmptyNewAcl().patternType.value}
      onSelect={(value) => {
        setAcls((prevState) => {
          const newPrevState = handle2DArrayAcls(prevState, row, childRow);
          if (value === undefined) {
            newPrevState.patternType.validated = ValidatedOptions.error;
            newPrevState.patternType.validated = t(
              'permission.manage_permissions_dialog.assign_permissions.must_select_pattern_type_error'
            );
          } else {
            newPrevState.patternType.validated = ValidatedOptions.default;
          }

          return update2DArrayAcls(prevState, newPrevState, row, childRow);
        });
      }}
    />
  );
};

export { PatternTypeCell };
