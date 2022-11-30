import React from 'react';
import { useTranslation } from 'react-i18next';

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

  const setResourceType = (row: number, value?: AclResourceType) => {
    setAcls((prevState) =>
      prevState.map((v, k) => {
        if (k === row) {
          if (Array.isArray(v)) {
            v[row].resourceType = { value };
          } else {
            v.resourceType = { value };
          }
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
            // TS fix: not sure about this commented out area, it doesn't seem to be read anywhere
            // newPrevState.validated = ValidatedOptions.error;
            // newPrevState.errorMessage = t(
            //   'permission.manage_permissions_dialog.assign_permissions.must_select_resource_type_error'
            // );
          } else {
            // TS fix: not sure about this commented out area, it doesn't seem to be read anywhere
            // newPrevState.validated = ValidatedOptions.default;
          }
          return update2DArrayAcls(prevState, newPrevState, row, childRow);
        });
      }}
    />
  );
};

export { ResourceType };
