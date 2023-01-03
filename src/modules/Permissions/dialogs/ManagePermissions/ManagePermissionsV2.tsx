import { AclBinding } from '@rhoas/app-services-ui-shared/dist/esm/contexts/modals/kafka-modals';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { usePermissionsService } from '@app/services/acls';
import { ConfigContext, useFederated } from '@app/contexts';
import {
  BaseModalProps,
  ManagePermissionsModalProps,
  ManagePermissionsProps,
  usePrincipals,
  useAuth,
  useAlert,
  AlertVariant,
} from '@rhoas/app-services-ui-shared';
import './ManagePermissions.css';
import {
  Account,
  AddAclType,
  ManageKafkaPermissions,
  PrincipalType,
} from '@rhoas/app-services-ui-components';
import { transformResourceType, transformResourceOperation } from '../../utils';

export const ManagePermissionsV2: React.VFC<
  ManagePermissionsProps & BaseModalProps
> = ({
  hideModal,
  onSave,
  kafkaName,
  selectedAccountId,
  acls,
  topicNames,
  consumerGroupIds,
  title,
  variant,
}) => {
  return (
    <ManagePermissionsModal
      topicNames={topicNames}
      consumerGroupIds={consumerGroupIds}
      acls={acls}
      resourceOperations={undefined}
      hideModal={hideModal}
      selectedAccountId={selectedAccountId}
      onSave={onSave}
      kafkaName={kafkaName}
      variant={variant}
      title={title}
    />
  );
};

export const ManagePermissionsModal: React.FC<
  ManagePermissionsModalProps & BaseModalProps
> = ({ hideModal, kafkaName, acls, topicNames, consumerGroupIds }) => {
  const { kafka } = useFederated() || {};
  const auth = useAuth();

  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(
    undefined
  );
  const [isAclDeleted, setIsAclDeleted] = useState<boolean>(false);
  const [deletedAcls, setDeletedAcls] = useState<AclBinding[]>([]);
  const [existingAcls, setExistingAcls] = useState<AclBinding[]>(
    (acls || []).filter(
      (i) =>
        (selectedAccount &&
          selectedAccount &&
          i.principal === `${selectedAccount}`) ||
        i.principal === '*'
    )
  );
  const [currentlyLoggedInuser, setCurrentlyLoggedInuser] = useState<
    string | undefined
  >();

  const aclsForSelectedAccount = useCallback(async () => {
    setExistingAcls(
      (acls || []).filter(
        (i) =>
          (selectedAccount &&
            selectedAccount &&
            i.principal === `${selectedAccount}`) ||
          i.principal === '*'
      )
    );
  }, [acls, selectedAccount]);

  useEffect(() => {
    aclsForSelectedAccount();
  }, [acls, aclsForSelectedAccount, selectedAccount]);

  const principals = usePrincipals();
  const { addAlert } = useAlert() || {
    addAlert: () => {
      // No-op
    },
  };

  const config = useContext(ConfigContext);
  const permissionsService = usePermissionsService(config);

  useEffect(() => {
    const getUsername = async () => {
      const username = await auth?.getUsername();
      setCurrentlyLoggedInuser(username);
    };
    getUsername();
  }, [auth]);

  const principal = principals
    .getAllPrincipals()
    .filter((p) => p.id !== currentlyLoggedInuser && p.id !== kafka?.owner);

  const accounts: Account[] = principal.map((value) => ({
    displayName: value.displayName || '',
    id: value.id || '',
    principalType: value.principalType || PrincipalType.UserAccount,
  }));

  const updateExistingAcls = (row: number) => {
    setExistingAcls((existingAcls || []).filter((_, index) => index != row));
  };

  const onRemoveAcls = async (row: number) => {
    setDeletedAcls((prevState) => [...prevState, existingAcls[row]]);
    setIsAclDeleted(true);
    updateExistingAcls(row);
  };
  const onSaveAcl = async (data: AddAclType[] | undefined) => {
    if (deletedAcls.length > 0) {
      deletedAcls.map(async (value) => {
        await permissionsService
          .deletePermission({
            resourceName: value.resourceName,
            patternType: value.patternType,
            permissionType: value.permission,
            resourceType: value.resourceType,
            operation: value.operation,
            principal: `User:${
              selectedAccount == 'All accounts' ? '*' : selectedAccount
            }`,
          })
          .then(() => hideModal())

          .catch((error) =>
            addAlert({
              variant: AlertVariant.danger,
              title: error.response.data.reason,
            })
          );
      });
    }

    data &&
      data.map(async (value) => {
        switch (value.type) {
          case 'manage-access': {
            await permissionsService
              .addPermission({
                resourceName: 'kafka-cluster',
                resourceType: 'CLUSTER',
                patternType: 'LITERAL',
                operation: 'ALTER',
                permission: 'ALLOW',
                principal:
                  selectedAccount == 'All accounts'
                    ? `User:*`
                    : `User:${selectedAccount}`,
              })
              .then(() => hideModal());
            break;
          }
          case 'manual': {
            await permissionsService
              .addPermission({
                resourceName: value.resourceName ? value.resourceName : '',
                resourceType: transformResourceType(value.resourceType),
                patternType:
                  value.resourcePrefix == 'Is' ? 'LITERAL' : 'PREFIXED',
                operation: transformResourceOperation(value.resourceOperation),
                permission:
                  value.resourcePermission == 'allow' ? 'ALLOW' : 'DENY',
                principal:
                  selectedAccount == 'All accounts'
                    ? `User:*`
                    : `User:${selectedAccount}`,
              })
              .then(() => hideModal());
            break;
          }
          case 'produce-topic': {
            await permissionsService.addPermission({
              resourceName: value.resourceNameValue || '',
              resourceType: 'TOPIC',
              patternType:
                value.prefixRuleValue == 'Is' ? 'LITERAL' : 'PREFIXED',
              operation: 'WRITE',
              permission: 'ALLOW',
              principal:
                selectedAccount == 'All accounts'
                  ? `User:*`
                  : `User:${selectedAccount}`,
            });
            await permissionsService.addPermission({
              resourceName: value.resourceNameValue || '',
              resourceType: 'TOPIC',
              patternType:
                value.prefixRuleValue == 'Is' ? 'LITERAL' : 'PREFIXED',
              operation: 'CREATE',
              permission: 'ALLOW',
              principal:
                selectedAccount == 'All accounts'
                  ? `User:*`
                  : `User:${selectedAccount}`,
            });
            await permissionsService
              .addPermission({
                resourceName: value.resourceNameValue || '',
                resourceType: 'TOPIC',
                patternType:
                  value.prefixRuleValue == 'Is' ? 'LITERAL' : 'PREFIXED',
                operation: 'DESCRIBE',
                permission: 'ALLOW',
                principal:
                  selectedAccount == 'All accounts'
                    ? `User:*`
                    : `User:${selectedAccount}`,
              })
              .then(() => hideModal());
            break;
          }
          case 'consume-topic': {
            await permissionsService.addPermission({
              resourceName: value.topicResourceName || '',
              resourceType: 'TOPIC',
              patternType:
                value.topicResourcePrefixRule == 'Is' ? 'LITERAL' : 'PREFIXED',
              operation: 'READ',
              permission: 'ALLOW',
              principal:
                selectedAccount == 'All accounts'
                  ? `User:*`
                  : `User:${selectedAccount}`,
            });
            await permissionsService.addPermission({
              resourceName: value.topicResourceName || '',
              resourceType: 'TOPIC',
              patternType:
                value.topicResourcePrefixRule == 'Is' ? 'LITERAL' : 'PREFIXED',
              operation: 'DESCRIBE',
              permission: 'ALLOW',
              principal:
                selectedAccount == 'All accounts'
                  ? `User:*`
                  : `User:${selectedAccount}`,
            });
            await permissionsService
              .addPermission({
                resourceName: value.consumerResourceName || '',
                resourceType: 'GROUP',
                patternType:
                  value.consumerResourcePrefixRule == 'Is'
                    ? 'LITERAL'
                    : 'PREFIXED',
                operation: 'READ',
                permission: 'ALLOW',
                principal:
                  selectedAccount == 'All accounts'
                    ? `User:*`
                    : `User:${selectedAccount}`,
              })
              .then(() => hideModal());
            break;
          }
        }
      });
  };
  const filterTopics = (filter: string) => {
    return topicNames.filter((v) => v.includes(filter));
  };
  const filterConsumerGroups = (filter: string) => {
    return consumerGroupIds.filter((v) => v.includes(filter));
  };
  return (
    <ManageKafkaPermissions
      accounts={accounts}
      onCancel={hideModal}
      kafkaName={kafkaName || ''}
      onSave={onSaveAcl}
      existingAcls={existingAcls}
      onRemoveAcls={onRemoveAcls}
      selectedAccount={selectedAccount}
      onChangeSelectedAccount={setSelectedAccount}
      topicNameOptions={filterTopics}
      consumerGroupNameOptions={filterConsumerGroups}
      isAclDeleted={isAclDeleted}
    />
  );
};

export default ManagePermissionsV2;
