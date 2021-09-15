import {Validated} from '@app/modules/Permissions/components/ManagePermissionsDialog/validated';
import {AclOperation, AclPatternType, AclPermissionType, AclResourceType,} from '@rhoas/kafka-instance-sdk';

export const AllAccountsId = '*';

export const isNewAclModified = (value: NewAcl): boolean => {
  const emptyAcl = createEmptyNewAcl();
  return !(
    value.permission.value === emptyAcl.permission.value && value.patternType.value === emptyAcl.patternType.value && value.resourceType.value === emptyAcl.resourceType.value && value.resource.value === emptyAcl.resource.value && value.operation.value === emptyAcl.operation.value
  );
};

export type NewAcl = {
  permission: Validated<AclPermissionType | undefined>;
  operation: Validated<AclOperation | undefined>;
  resourceType: Validated<AclResourceType | undefined>;
  patternType: Validated<AclPatternType | undefined>;
  resource: Validated<string | undefined>;
};

export const createEmptyNewAcl = (): NewAcl => {
  return {
    permission: {
      value: AclPermissionType.Allow,
    },
    operation: {
      value: undefined,
    },
    resourceType: {
      value: undefined,
    },
    patternType: {
      value: AclPatternType.Prefixed,
    },
    resource: {
      value: undefined,
    },
  } as NewAcl;
};
