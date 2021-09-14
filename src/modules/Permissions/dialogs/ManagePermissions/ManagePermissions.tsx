import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Form, FormGroup, Grid, GridItem, Modal, ModalVariant,} from '@patternfly/react-core';
import {useTranslation} from 'react-i18next';
import {createPermissionsService, EnhancedAclBinding,} from '@app/services/acls';
import {ConfigContext} from '@app/contexts';
import {usePrincipals} from '@bf2/ui-shared';
import {BaseModalProps} from '@app/components/KafkaModal/ModalTypes';
import {SelectAccount} from '@app/modules/Permissions/components/ManagePermissionsDialog/SelectAccount';
import {CreatePermissions} from '@app/modules/Permissions/components/ManagePermissionsDialog/CreatePermissions';
import {Validated} from '@app/modules/Permissions/components/ManagePermissionsDialog/validated';
import {
  createEmptyNewAcl,
  isNewAclModified,
  NewAcl,
} from '@app/modules/Permissions/components/ManagePermissionsDialog/acls';
import {FormGroupWithPopover, MASLoading} from '@app/components';
import {useValidateTopic} from '@app/services/topicNameValidation';
import {ExistingAclTable} from '@app/modules/Permissions/components/ManagePermissionsDialog/ExistingAclTable';

export type ManagePermissionsProps = {
  onSave?: () => Promise<void>;
  kafkaName?: string;
  topicNames: string[];
  consumerGroupIds: string[];
  selectedAccountId?: string;
  acls: Array<EnhancedAclBinding>;
};

export const ManagePermissions: React.FC<ManagePermissionsProps & BaseModalProps> = ({
                                                                                       hideModal,
                                                                                       onSave,
                                                                                       kafkaName,
                                                                                       selectedAccountId,
                                                                                       acls,
                                                                                       topicNames,
                                                                                       consumerGroupIds,
                                                                                     }) => {
  const {t} = useTranslation();

  const [selectedAccount, setSelectedAccount] = useState<Validated<string | undefined>>({value: selectedAccountId});
  const [step, setStep] = useState<number>(1);
  const [newAcls, setNewAcls] = useState<NewAcl[]>([createEmptyNewAcl()]);
  const escapeClosesModal = useRef<boolean>(true);
  const {validateName} = useValidateTopic();
  const resourceOperations = useRef<{ [key: string]: Array<string> }>();

  const principals = usePrincipals();

  const config = useContext(ConfigContext);
  const permissionsService = createPermissionsService(config);

  useEffect(() => {
    const fetchResourceOperations = async () => {
      const answer = await permissionsService.getResourceOperations();
      resourceOperations.current = answer;
    };
    if (resourceOperations.current === undefined) {
      fetchResourceOperations();
    }
  }, []);

  const save = async () => {
    let valid = true;
    if (selectedAccount.value === undefined) {
      setSelectedAccount((v) => {
        return {
          ...v,
          validated: 'error',
          errorMessage: t(
            'permission.manage_permissions_dialog.must_select_account_error'
          ),
        };
      });
      valid = false;
    } else {
      setSelectedAccount((v) => {
        return {
          ...v,
          validated: 'success',
        };
      });
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
            answer.resource.validated = 'error';
            answer.resource.errorMessage = t(
              'permission.manage_permissions_dialog.assign_permissions.must_select_resource_error'
            );
            valid = false;
          } else {
            const errorMessage = validateName(value.resource.value);
            if (errorMessage !== undefined) {
              answer.resource.validated = 'error';
              answer.resource.errorMessage = errorMessage;
              valid = false;
            } else {
              answer.resource.validated = 'success';
            }
          }
          if (value.patternType.value === undefined) {
            answer.patternType.validated = 'error';
            answer.patternType.errorMessage = t(
              'permission.manage_permissions_dialog.assign_permissions.must_select_pattern_type_error'
            );
            valid = false;
          } else {
            answer.patternType.validated = 'success';
          }
          if (value.permission.value === undefined) {
            answer.permission.validated = 'error';
            answer.permission.errorMessage = t(
              'permission.manage_permissions_dialog.assign_permissions.must_select_permission_error'
            );
            valid = false;
          } else {
            answer.permission.validated = 'success';
          }
          if (value.resourceType.value === undefined) {
            answer.resourceType.validated = 'error';
            answer.resourceType.errorMessage = t(
              'permission.manage_permissions_dialog.assign_permissions.must_select_resource_type_error'
            );
            valid = false;
          } else {
            answer.resourceType.validated = 'success';
          }
          if (value.operation.value === undefined) {
            answer.operation.validated = 'error';
            answer.operation.errorMessage = t(
              'permission.manage_permissions_dialog.assign_permissions.must_select_operation_error'
            );
            valid = false;
          } else {
            answer.operation.validated = 'success';
          }
          return answer;
        }
        return value;
      });
    });
    if (valid) {
      for (const value1 of newAcls.filter((value) => isNewAclModified(value))) {
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

  const Step2 = () => {
    if (step === 2) {
      if (resourceOperations.current === undefined) {
        return <MASLoading/>;
      }
      const menuAppendTo = document.getElementById('manage-permissions-modal') || undefined;
      return (
        <>
          <ExistingAclTable
            existingAcls={acls.filter(
              (i) =>
                i.principal === `${selectedAccountId}` || i.principal === '*'
            )}
            selectedAccountId={selectedAccount.value}
          />
          <CreatePermissions
            acls={newAcls}
            setAcls={setNewAcls}
            topicNames={topicNames}
            consumerGroupIds={consumerGroupIds}
            selectedAccount={selectedAccount.value}
            setEscapeClosesModal={setEscapeClosesModal}
            resourceOperations={resourceOperations.current}
            menuAppendTo={menuAppendTo}
          />
        </>
      );
    }
    return <></>;
  };

  const Account = () => {
    if (step === 1) {
      return (
        <SelectAccount
          id={selectedAccount}
          setId={setSelectedAccount}
          initialOptions={principals.getAllPrincipals()}
          setEscapeClosesModal={setEscapeClosesModal}
        />
      );
    }
    return (
      <FormGroupWithPopover
        labelHead={t('permission.manage_permissions_dialog.account_id_title')}
        fieldId='kafka-instance-name'
        fieldLabel={t('permission.manage_permissions_dialog.account_id_title')}
        labelBody={t('permission.manage_permissions_dialog.account_id_help')}
        buttonAriaLabel={t(
          'permission.manage_permissions_dialog.account_id_aria'
        )}
        isRequired={true}
      >
        {selectedAccount.value === '*'
          ? t('permission.manage_permissions_dialog.all_accounts_title')
          : selectedAccount.value}
      </FormGroupWithPopover>
    );
  };

  const setEscapeClosesModal = (closes: boolean) => {
    escapeClosesModal.current = closes;
  };

  const onEscapePress = () => {
    if (escapeClosesModal.current) {
      hideModal();
    }
  };

  const SubmitButton: React.FunctionComponent = () => {
    if (step === 1) {
      return (
        <Button
          variant='primary'
          onClick={() => setStep(2)}
          isDisabled={selectedAccount.value === undefined}
        >
          {t('permission.manage_permissions_dialog.step_1_submit_button')}
        </Button>
      );
    }
    return (
      <Button
        variant='primary'
        onClick={save}
        key={1}
        isDisabled={!newAcls.some((p) => isNewAclModified(p))}
      >
        {t('permission.manage_permissions_dialog.step_2_submit_button')}
      </Button>
    );
  };

  return (
    <Modal
      id="manage-permissions-modal"
      variant={ModalVariant.large}
      isOpen={true}
      aria-label={t('permission.manage_permissions_dialog.aria_label')}
      title={t('permission.manage_permissions_dialog.title')}
      showClose={true}
      aria-describedby='modal-message'
      onClose={hideModal}
      onEscapePress={onEscapePress}
      actions={[
        <SubmitButton key={1}/>,
        <Button onClick={hideModal} key={2} variant='secondary'>
          {t('permission.manage_permissions_dialog.cancel_button')}
        </Button>,
      ]}
    >
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
            <Account/>
          </GridItem>
        </Grid>
        <Step2/>
      </Form>
    </Modal>
  );
};

export default ManagePermissions;
