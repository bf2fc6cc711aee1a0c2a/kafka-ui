import { Validated } from '@app/modules/Permissions/components/ManagePermissionsDialog/validated';
import {
  AclOperation,
  AclPatternType,
  AclPermissionType,
  AclResourceType,
} from '@rhoas/kafka-instance-sdk';

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
      value: undefined,
    },
    operation: {
      value: undefined,
    },
    resourceType: {
      value: undefined,
    },
    patternType: {
      value: undefined,
    },
    resource: {
      value: undefined,
    },
  } as NewAcl;
};
