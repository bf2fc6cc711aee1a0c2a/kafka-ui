import React from 'react';
import { useTranslation } from 'react-i18next';
import { ValidatedOptions } from '@patternfly/react-core';

import { AclResourceType } from '@rhoas/kafka-instance-sdk';
import {
  AclShortcutType,
  update2DArrayAcls,
  handle2DArrayAcls,
  AclCellProps,
} from './acls';
import { CreateTypeahead } from './CreateTypeahead';
import { useValidateTopic } from '@app/modules/Topics/utils';

type ResourceCellProps = AclCellProps & {
  topicNames: string[];
  consumerGroupIds: string[];
};

const ResourceCell: React.FC<ResourceCellProps> = ({
  row,
  acl,
  childRow = 0,
  setAcls,
  setEscapeClosesModal,
  menuAppendTo,
  topicNames,
  consumerGroupIds,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const { validateName } = useValidateTopic();

  if (
    acl.resourceType.value === AclResourceType.Cluster ||
    acl.aclShortcutType === AclShortcutType.ManageAccess
  ) {
    return <></>;
  }

  const setResource = (row: number, value?: string, childRow?: number) => {
    setAcls((prevState) =>
      prevState.map((v, k) => {
        if (k === row) {
          if (Array.isArray(v) && childRow !== undefined)
            v[childRow].resource = { value };
          else v.resource = { value };
        }
        return v;
      })
    );
  };

  return (
    <CreateTypeahead
      row={row}
      childRow={childRow}
      value={acl.resource}
      setValue={setResource}
      id='resource'
      placeholder={t(
        `permission.manage_permissions_dialog.assign_permissions.pattern_type_${
          acl.patternType.value?.toLowerCase() || 'prefixed'
        }_placeholder`
      )}
      setEscapeClosesModal={setEscapeClosesModal}
      menuAppendTo={menuAppendTo}
      initialOptions={() => {
        if (acl.resourceType.value === AclResourceType.Topic) {
          return topicNames;
        }
        if (acl.resourceType.value === AclResourceType.Group) {
          return consumerGroupIds;
        }
        return [];
      }}
      onSelect={(value) => {
        if (value === '*') {
          setAcls((prevState) => {
            const newPrevState = handle2DArrayAcls(prevState, row, childRow);
            newPrevState.resource.validated = ValidatedOptions.default;
            return update2DArrayAcls(prevState, newPrevState, row, childRow);
          });
        } else {
          const errorMessage = validateName(value);
          if (errorMessage !== undefined) {
            setAcls((prevState) => {
              const newPrevState = handle2DArrayAcls(prevState, row, childRow);
              newPrevState.validated = ValidatedOptions.error;
              newPrevState.errorMessage = errorMessage;
              return update2DArrayAcls(prevState, newPrevState, row, childRow);
            });
          } else if (value !== undefined) {
            setAcls((prevState) => {
              const newPrevState = handle2DArrayAcls(prevState, row, childRow);
              newPrevState.validated = ValidatedOptions.default;
              return update2DArrayAcls(prevState, newPrevState, row, childRow);
            });
          }
        }
      }}
    />
  );
};

export { ResourceCell };
