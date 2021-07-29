import React, { useContext, useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import {
  createPermissionsService,
  EnhancedAclBinding,
} from '@app/services/acls';
import { ConfigContext } from '@app/contexts';
import { usePrincipals } from '@bf2/ui-shared';
import { BaseModalProps } from '@app/components/KafkaModal/ModalTypes';
import { SelectAccount } from '@app/modules/Permissions/components/ManagePermissionsDialog/SelectAccount';
import { EditExisting } from '@app/modules/Permissions/components/ManagePermissionsDialog/EditExistingPermissions';
import { CreatePermissions } from '@app/modules/Permissions/components/ManagePermissionsDialog/CreatePermissions';
import { Validated } from '@app/modules/Permissions/components/ManagePermissionsDialog/validated';
import {
  createEmptyNewAcl,
  NewAcl,
} from '@app/modules/Permissions/components/ManagePermissionsDialog/acls';

export type ManagePermissionsProps = {
  onSave?: () => Promise<void>;
  kafkaName?: string;
  topicNames: string[];
  consumerGroupIds: string[];
  selectedAccountId?: string;
  acls: Array<EnhancedAclBinding>;
};

export const ManagePermissions: React.FC<
  ManagePermissionsProps & BaseModalProps
> = ({
  hideModal,
  onSave,
  kafkaName,
  selectedAccountId,
  acls,
  topicNames,
  consumerGroupIds,
}) => {
  const { t } = useTranslation();

  const [selectedAccount, setSelectedAccount] = useState<
    Validated<string | undefined>
  >({ value: selectedAccountId });
  const [newAcls, setNewAcls] = useState<NewAcl[]>([createEmptyNewAcl()]);

  const principals = usePrincipals();

  const config = useContext(ConfigContext);
  const permissionsService = createPermissionsService(config);

  const save = async () => {
    let valid = true;
    if (selectedAccount.value === undefined) {
      setSelectedAccount((v) => {
        return {
          ...v,
          invalid: true,
          errorMessage: t(
            'permission.manage_permissions_dialog.must_select_account_error'
          ),
        };
      });
      valid = false;
    }
    setNewAcls((prevState) => {
      return prevState.map((value) => {
        if (
          value.resource.value !== undefined ||
          value.patternType.value !== undefined ||
          value.permission.value !== undefined ||
          value.resourceType.value !== undefined ||
          value.operation.value !== undefined
        ) {
          const answer = Object.assign({}, value);
          if (value.resource.value === undefined) {
            answer.resource.invalid = true;
            answer.resource.errorMessage = t(
              'permission.manage_permissions_dialog.create_permissions.must_select_resource_error'
            );
            valid = false;
          }
          if (value.patternType.value === undefined) {
            answer.patternType.invalid = true;
            answer.patternType.errorMessage = t(
              'permission.manage_permissions_dialog.create_permissions.must_select_pattern_type_error'
            );
            valid = false;
          }
          if (value.permission.value === undefined) {
            answer.permission.invalid = true;
            answer.permission.errorMessage = t(
              'permission.manage_permissions_dialog.create_permissions.must_select_permission_error'
            );
            valid = false;
          }
          if (value.resourceType.value === undefined) {
            answer.resourceType.invalid = true;
            answer.resourceType.errorMessage = t(
              'permission.manage_permissions_dialog.create_permissions.must_select_resource_type_error'
            );
            valid = false;
          }
          if (value.operation.value === undefined) {
            answer.operation.invalid = true;
            answer.operation.errorMessage = t(
              'permission.manage_permissions_dialog.create_permissions.must_select_operation_error'
            );
            valid = false;
          }
          return answer;
        }
        return value;
      });
    });
    if (valid) {
      for (const value1 of newAcls.filter(
        (value) =>
          value.resource.value !== undefined ||
          value.patternType.value !== undefined ||
          value.permission.value !== undefined ||
          value.resourceType.value !== undefined ||
          value.operation.value !== undefined
      )) {
        if (value1.resource.value === undefined) {
          throw Error('resource must not be undefined');
        }
        if (value1.patternType.value === undefined) {
          throw Error('patternType must not be undefined');
        }
        if (value1.permission.value === undefined) {
          throw Error('permission must not be undefined');
        }
        if (value1.resourceType.value === undefined) {
          throw Error('resourceType must not be undefined');
        }
        if (value1.operation.value === undefined) {
          throw Error('operation must not be undefined');
        }
        await permissionsService.addPermission({
          resourceName: value1.resource.value,
          patternType: value1.patternType.value,
          permission: value1.permission.value,
          resourceType: value1.resourceType.value,
          operation: value1.operation.value,
          principal: `User:${selectedAccount.value}`,
        });
      }
      onSave && (await onSave());
      hideModal();
    }
  };

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={true}
      aria-label={t('permission.manage_permissions_dialog.aria_label')}
      title={t('permission.manage_permissions_dialog.title')}
      showClose={true}
      aria-describedby='modal-message'
      onClose={hideModal}
      actions={[
        <Button variant='primary' onClick={save} key={1}>
          {t('permission.manage_permissions_dialog.update_button')}
        </Button>,
        <Button variant='link' onClick={hideModal} key={2}>
          {t('permission.manage_permissions_dialog.cancel_button')}
        </Button>,
      ]}
    >
      {t('permission.manage_permissions_dialog.main_help')}
      <Form>
        <Grid hasGutter md={6}>
          <GridItem span={12}>
            <FormGroup
              fieldId='kafka-instance-name'
              label={t(
                'permission.manage_permissions_dialog.kafka_instance_title'
              )}
            >
              {kafkaName}
            </FormGroup>
          </GridItem>
          <GridItem span={12}>
            <SelectAccount
              id={selectedAccount}
              setId={setSelectedAccount}
              initialOptions={principals.getAllPrincipals()}
            />
          </GridItem>
        </Grid>
        <EditExisting
          existingAcls={acls}
          selectedAccountId={selectedAccount.value}
        />
        <CreatePermissions
          acls={newAcls}
          setAcls={setNewAcls}
          topicNames={topicNames}
          consumerGroupIds={consumerGroupIds}
        />
      </Form>
    </Modal>
  );
};

export default ManagePermissions;
