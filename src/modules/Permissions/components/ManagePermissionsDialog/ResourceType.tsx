import React from 'react';
import { useTranslation } from 'react-i18next';
import { ValidatedOptions } from '@patternfly/react-core';

import { AclResourceType } from '@rhoas/kafka-instance-sdk';
import {
  AclShortcutType,
  createEmptyNewAcl,
  update2DArrayAcls,
  handle2DArrayAcls,
  AclCellProps,
} from './acls';
import { CreateSelect } from './CreateSelect';
import { getResourceTypes } from '@app/services/acls';
import { SelectOption } from '@app/modules/Permissions/components/ManagePermissionsDialog/select';
import { SolidLabel } from './SolidLabel';
import { displayName } from '@app/modules/Permissions/utils';

type ResourceTypeProps = AclCellProps & {
  kafkaName: string | undefined;
};

const ResourceType: React.VFC<ResourceTypeProps> = ({
  row,
  acl,
  childRow = 0,
  setAcls,
  setEscapeClosesModal,
  menuAppendTo,
  kafkaName,
}) => {
  const { resourceType } = acl;
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  if (
    (acl.aclShortcutType === AclShortcutType.ConsumeTopic ||
      acl.aclShortcutType === AclShortcutType.ProduceTopic) &&
    resourceType?.value
  ) {
    return (
      <>
        <SolidLabel variant={resourceType.value} />{' '}
        {displayName(resourceType.value)}
      </>
    );
  } else if (acl.aclShortcutType === AclShortcutType.ManageAccess) {
    return (
      <>
        <SolidLabel variant={AclResourceType.Cluster} />{' '}
        {displayName(AclResourceType.Cluster)} is "{kafkaName}"
      </>
    );
  }

  const setResourceType = (
    row: number,
    value?: AclResourceType,
    childRow?: number
  ) => {
    setAcls((prevState) =>
      prevState.map((v, k) => {
        if (k === row) {
          if (Array.isArray(v) && childRow !== undefined)
            v[row][childRow].resourceType = { value };
          else v.resourceType = { value };
        }
        return v;
      })
    );
  };

  return (
    <CreateSelect
      options={getResourceTypes().map((value) => {
        return {
          value,
          title: displayName(value),
        } as SelectOption<AclResourceType>;
      })}
      selected={acl.resourceType}
      setSelected={setResourceType}
      row={row}
      id='resource-type'
      placeholder={t(
        'permission.manage_permissions_dialog.assign_permissions.resource_type_placeholder'
      )}
      setEscapeClosesModal={setEscapeClosesModal}
      menuAppendTo={menuAppendTo}
      onClear={() => createEmptyNewAcl().resourceType.value}
      onSelect={(value) => {
        setAcls((prevState) => {
          const newPrevState = handle2DArrayAcls(prevState, row, childRow);
          if (value === undefined) {
            newPrevState.validated = ValidatedOptions.error;
            newPrevState.errorMessage = t(
              'permission.manage_permissions_dialog.assign_permissions.must_select_resource_type_error'
            );
          } else {
            newPrevState.validated = ValidatedOptions.default;
          }
          return update2DArrayAcls(prevState, newPrevState, row, childRow);
        });
      }}
    />
  );
};

export { ResourceType };
