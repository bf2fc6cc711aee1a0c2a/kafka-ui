import { AxiosResponse } from 'axios';
import {
  AclBinding,
  AclBindingListPage,
  AclOperation,
  AclOperationFilter,
  AclPatternType,
  AclPatternTypeFilter,
  AclPermissionType,
  AclPermissionTypeFilter,
  AclResourceType,
  AclResourceTypeFilter,
  AclsApi,
  Configuration,
} from '@rhoas/kafka-instance-sdk';
import { IConfiguration } from '@app/contexts';
import objectHash from 'object-hash';

export type PermissionsService = {
  getPermissions(
    filter: AclFilter,
    size?: number,
    page?: number
  ): Promise<EnhancedAclBindingListPage>;

  addPermission(acl: AclBinding): Promise<void>;
  deletePermission(acl: AclFilter): Promise<void>;
  getResourceOperations(): Promise<{ [key: string]: Array<string> }>;
};

export const convertEnum = <T extends { toString: () => string }, F>(
  p: T,
  filter: { [name: string]: unknown }
): F => {
  const [, v] =
    Object.entries(filter).find(([, v]) => v === p.toString()) || [];
  return v as F;
};

export type EnhancedAclBinding = AclBinding & {
  hash: () => string;
};

export type EnhancedAclBindingListPage = Omit<AclBindingListPage, 'items'> & {
  items?: Array<EnhancedAclBinding>;
};

export type AclFilter = {
  resourceType?: AclResourceTypeFilter;
  resourceName?: string;
  patternType?: AclPatternTypeFilter;
  principal?: string;
  operation?: AclOperationFilter;
  permissionType?: AclPermissionTypeFilter;
};

export const usePermissionsService = (
  config: IConfiguration | undefined
): PermissionsService => {
  const getPermissions = async (
    filter: AclFilter,
    size?: number,
    page?: number
  ): Promise<EnhancedAclBindingListPage> => {
    const accessToken = await config?.getToken();

    const api = new AclsApi(
      new Configuration({
        accessToken,
        basePath: config?.basePath,
      })
    );
    const response: AxiosResponse<AclBindingListPage> = await api.getAcls(
      filter.resourceType,
      filter.resourceName,
      filter.patternType,
      filter.principal,
      filter.operation,
      filter.permissionType,
      page,
      size
    );
    return enhanceAclBindingListPage(response);
  };

  const addPermission = async (acl: AclBinding) => {
    const accessToken = await config?.getToken();
    const api = new AclsApi(
      new Configuration({
        accessToken,
        basePath: config?.basePath,
      })
    );
    await api.createAcl(acl);
  };

  const deletePermission = async (acl: AclFilter) => {
    const accessToken = await config?.getToken();
    const api = new AclsApi(
      new Configuration({
        accessToken,
        basePath: config?.basePath,
      })
    );
    await api.deleteAcls(
      acl.resourceType,
      acl.resourceName,
      acl.patternType,
      acl.principal,
      acl.operation,
      acl.permissionType
    );
  };

  const getResourceOperations = async () => {
    const accessToken = await config?.getToken();
    const api = new AclsApi(
      new Configuration({
        accessToken,
        basePath: config?.basePath,
      })
    );
    return await api
      .getAclResourceOperations()
      .then((response) => response.data);
  };

  return {
    getPermissions,
    addPermission,
    deletePermission,
    getResourceOperations,
  } as PermissionsService;
};

const enhanceAclBindingListPage = (
  response: AxiosResponse<AclBindingListPage>
): EnhancedAclBindingListPage => {
  return {
    total: response.data.total,
    size: response.data.size,
    page: response.data.page,
    items: response.data.items
      ?.map((item) => {
        return {
          ...item,
          // Strip out the "User:" prefix
          principal: item.principal.substring(5),
          toString: () => {
            return `${item.principal} ${item.permission} ${item.operation} ${item.patternType} ${item.resourceType} ${item.resourceName}`;
          },
          hash: () => {
            return objectHash(item);
          },
        } as EnhancedAclBinding;
      })
      .sort((a, b) => {
        if (a.permission !== b.permission) {
          if (a.permission === 'DENY') {
            return -1;
          } else {
            return 1;
          }
        } else if (a.principal !== b.principal) {
          return a.principal.localeCompare(b.principal);
        } else if (a.resourceType !== b.resourceType) {
          return a.resourceType.localeCompare(b.resourceType);
        } else if (a.resourceName !== b.resourceName) {
          return a.resourceName.localeCompare(b.resourceName);
        } else if (a.operation !== b.operation) {
          return a.operation.localeCompare(b.operation);
        } else {
          return 0;
        }
      }),
  } as EnhancedAclBindingListPage;
};

export const getPermissionsTypes = (): AclPermissionType[] => {
  return Object.values(AclPermissionType);
};

export const getOperations = (): AclOperation[] => {
  return Object.values(AclOperation);
};

export const getResourceTypes = (): AclResourceType[] => {
  return Object.values(AclResourceType);
};

export const getPatternTypes = (): AclPatternType[] => {
  return Object.values(AclPatternType);
};
