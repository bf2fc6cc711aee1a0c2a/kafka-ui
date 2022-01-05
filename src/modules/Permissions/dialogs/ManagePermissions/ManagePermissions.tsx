import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Form,
  FormAlert,
  FormGroup,
  Modal,
  ValidatedOptions,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import {
  convertEnum,
  EnhancedAclBinding,
  usePermissionsService,
} from '@app/services/acls';
import { ConfigContext, useFederated } from '@app/contexts';
import {
  BaseModalProps,
  ManagePermissionsModalProps,
  ManagePermissionsProps,
  usePrincipals,
  useAuth,
} from '@rhoas/app-services-ui-shared';
import { SelectAccount } from '@app/modules/Permissions/components/ManagePermissionsDialog/SelectAccount';
import { CreatePermissions } from '@app/modules/Permissions/components/ManagePermissionsDialog/CreatePermissions';
import { Validated } from '@app/modules/Permissions/components/ManagePermissionsDialog/validated';
import {
  createEmptyNewAcl,
  isNewAclModified,
  NewAcl,
} from '@app/modules/Permissions/components/ManagePermissionsDialog/acls';
import { FormGroupWithPopover, MASLoading } from '@app/components';
import { useValidateTopic } from '@app/modules/Topics/utils';
import { ExistingAclTable } from '@app/modules/Permissions/components/ManagePermissionsDialog/ExistingAclTable';
import {
  AclOperationFilter,
  AclPatternType,
  AclPatternTypeFilter,
  AclPermissionTypeFilter,
  AclResourceType,
  AclResourceTypeFilter,
} from '@rhoas/kafka-instance-sdk';
import { PreCancelModal } from './PreCancelModal';
import './ManagePermissions.css';

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
  title,
  variant,
}) => {
  const config = useContext(ConfigContext);
  const permissionsService = usePermissionsService(config);
  const [resourceOperations, setResourceOperations] = useState<
    { [key: string]: Array<string> } | undefined
  >();

  useEffect(() => {
    const fetchResourceOperations = async () => {
      const answer = await permissionsService.getResourceOperations();
      setResourceOperations(answer);
    };
    fetchResourceOperations();
  }, []);

  return (
    <ManagePermissionsModal
      topicNames={topicNames}
      consumerGroupIds={consumerGroupIds}
      acls={acls}
      resourceOperations={resourceOperations}
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
> = ({
  hideModal,
  onSave,
  kafkaName,
  selectedAccountId,
  acls,
  topicNames,
  consumerGroupIds,
  resourceOperations,
  title,
  variant,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const { kafka } = useFederated() || {};
  const auth = useAuth();

  const [selectedAccount, setSelectedAccount] = useState<
    Validated<string | undefined>
  >({ value: selectedAccountId, validated: undefined });
  const [step, setStep] = useState<number>(
    selectedAccountId === undefined ? 1 : 2
  );
  const [newAcls, setNewAcls] = useState<NewAcl[]>([createEmptyNewAcl()]);
  const [removeAcls, setRemoveAcls] = useState<EnhancedAclBinding[]>([]);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isOpenPreCancelModal, setIsOpenPreCancelModal] =
    useState<boolean>(false);

  const escapeClosesModal = useRef<boolean>(true);
  const { validateName } = useValidateTopic();
  const [currentlyLoggedInuser, setCurrentlyLoggedInuser] = useState<
    string | undefined
  >();

  const principals = usePrincipals();

  const config = useContext(ConfigContext);
  const permissionsService = usePermissionsService(config);

  useEffect(() => {
    const getUsername = async () => {
      const username = await auth?.getUsername();
      setCurrentlyLoggedInuser(username);
    };
    getUsername();
  }, [auth]);

  const save = async () => {
    setFormSubmitted(true);
    let valid = true;
    if (selectedAccount.value === undefined) {
      setSelectedAccount((v) => {
        return {
          ...v,
          validated: ValidatedOptions.error,
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
          validated: ValidatedOptions.default,
        };
      });
    }

    setNewAcls((prevState) => {
      return prevState.map((value) => {
        if (isNewAclModified(value)) {
          const answer = Object.assign({}, value);
          if (value.resourceType.value === undefined) {
            answer.resourceType.validated = ValidatedOptions.error;
            answer.resourceType.errorMessage = t(
              'permission.manage_permissions_dialog.assign_permissions.must_select_resource_type_error'
            );
            valid = false;
          } else {
            answer.resourceType.validated = ValidatedOptions.default;
          }
          if (value.resourceType.value !== AclResourceType.Cluster) {
            if (value.resource.value === undefined) {
              answer.resource.validated = ValidatedOptions.error;
              answer.resource.errorMessage = t(
                'permission.manage_permissions_dialog.assign_permissions.must_select_resource_error'
              );
              valid = false;
            } else if (value.resource.value === '*') {
              answer.resource.validated = ValidatedOptions.default;
            } else {
              const errorMessage = validateName(value.resource.value);
              if (errorMessage !== undefined) {
                answer.resource.validated = ValidatedOptions.error;
                answer.resource.errorMessage = errorMessage;
                valid = false;
              } else {
                answer.resource.validated = ValidatedOptions.default;
              }
            }
            if (value.patternType.value === undefined) {
              answer.patternType.validated = ValidatedOptions.error;
              answer.patternType.errorMessage = t(
                'permission.manage_permissions_dialog.assign_permissions.must_select_pattern_type_error'
              );
              valid = false;
            } else {
              answer.patternType.validated = ValidatedOptions.default;
            }
          }
          if (value.permission.value === undefined) {
            answer.permission.validated = ValidatedOptions.error;
            answer.permission.errorMessage = t(
              'permission.manage_permissions_dialog.assign_permissions.must_select_permission_error'
            );
            valid = false;
          } else {
            answer.permission.validated = ValidatedOptions.default;
          }
          if (value.operation.value === undefined) {
            answer.operation.validated = ValidatedOptions.error;
            answer.operation.errorMessage = t(
              'permission.manage_permissions_dialog.assign_permissions.must_select_operation_error'
            );
            valid = false;
          } else {
            answer.operation.validated = ValidatedOptions.default;
          }
          return answer;
        } else {
          return value;
        }
      });
    });
    if (valid) {
      for (const value of newAcls.filter((value) => isNewAclModified(value))) {
        if (value.resourceType.value === undefined) {
          setSelectedAccount((v) => {
            return {
              ...v,
              validated: ValidatedOptions.error,
            };
          });
          throw Error('resourceType must not be undefined');
        }
        if (value.resourceType.value !== AclResourceType.Cluster) {
          if (value.resource.value === undefined) {
            setSelectedAccount((v) => {
              return {
                ...v,
                validated: ValidatedOptions.error,
              };
            });
            throw Error('resource must not be undefined');
          }
          if (value.patternType.value === undefined) {
            setSelectedAccount((v) => {
              return {
                ...v,
                validated: ValidatedOptions.error,
              };
            });
            throw Error('patternType must not be undefined');
          }
        } else {
          value.resource.value = 'kafka-cluster';
          value.patternType.value = AclPatternType.Literal;
        }
        if (value.permission.value === undefined) {
          setSelectedAccount((v) => {
            return {
              ...v,
              validated: ValidatedOptions.error,
            };
          });
          throw Error('permission must not be undefined');
        }

        if (value.operation.value === undefined) {
          setSelectedAccount((v) => {
            return {
              ...v,
              validated: ValidatedOptions.error,
            };
          });
          throw Error('operation must not be undefined');
        }
        await permissionsService.addPermission({
          resourceName: value.resource.value,
          patternType: value.patternType.value,
          permission: value.permission.value,
          resourceType: value.resourceType.value,
          operation: value.operation.value,
          principal: `User:${selectedAccount.value}`,
        });
      }
      for (const value of removeAcls) {
        await permissionsService.deletePermission({
          resourceName: value.resourceName,
          patternType: convertEnum(value.patternType, AclPatternTypeFilter),
          permissionType: convertEnum(
            value.permission,
            AclPermissionTypeFilter
          ),
          resourceType: convertEnum(value.resourceType, AclResourceTypeFilter),
          operation: convertEnum(value.operation, AclOperationFilter),
          principal: `User:${selectedAccount.value}`,
        });
      }
      onSave && (await onSave());
      hideModal();
    }
  };

  const Step2 = () => {
    if (step === 2) {
      if (resourceOperations === undefined) {
        return <MASLoading />;
      }
      const menuAppendTo =
        document.getElementById('manage-permissions-modal') || undefined;

      const isFormInvalid = (): boolean[] => {
        return newAcls.map((value) => {
          return (
            value.operation.validated != 'default' ||
            value.patternType.validated != 'default' ||
            value.resource.validated != 'default' ||
            value.resourceType.validated != 'default'
          );
        });
      };

      const FormValidAlert: React.FunctionComponent = () => {
        console.log(isFormInvalid()[0]);
        if (formSubmitted && isFormInvalid()[0]) {
          return (
            <FormAlert>
              <Alert
                variant='danger'
                title={t('permission.manage_permissions_dialog.form_alert')}
                aria-live='polite'
                isInline
              />
            </FormAlert>
          );
        }
        return <></>;
      };
      return (
        <>
          <FormValidAlert />

          <ExistingAclTable
            existingAcls={acls.filter(
              (i) =>
                i.principal === `${selectedAccount.value}` ||
                i.principal === '*'
            )}
            selectedAccountId={selectedAccount.value}
            onRemove={(acl) =>
              setRemoveAcls((prevState) => {
                return [...prevState, acl];
              })
            }
          />
          <CreatePermissions
            acls={newAcls}
            setAcls={setNewAcls}
            topicNames={topicNames}
            consumerGroupIds={consumerGroupIds}
            selectedAccount={selectedAccount.value}
            setEscapeClosesModal={setEscapeClosesModal}
            resourceOperations={resourceOperations}
            menuAppendTo={menuAppendTo}
          />
        </>
      );
    }
    return <></>;
  };

  const principal = principals
    .getAllPrincipals()
    .filter((p) => p.id !== currentlyLoggedInuser && p.id !== kafka?.owner);

  const Account = () => {
    if (step === 1) {
      return (
        <SelectAccount
          id={selectedAccount}
          setId={setSelectedAccount}
          initialOptions={principal}
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

  const isDisabledSaveButton = !newAcls.some(
    (p) => isNewAclModified(p) || removeAcls.length > 0
  );

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
        isDisabled={isDisabledSaveButton}
      >
        {t('permission.manage_permissions_dialog.step_2_submit_button')}
      </Button>
    );
  };

  const ModalForm: React.FunctionComponent = () => (
    <Form>
      <FormGroup
        fieldId='kafka-instance-name'
        label={t('permission.manage_permissions_dialog.kafka_instance_title')}
      >
        {kafkaName}
      </FormGroup>
      <Account />
      <Step2 />
    </Form>
  );

  const closePermissionModal = () => {
    if (step === 2 && !isDisabledSaveButton) {
      setIsOpenPreCancelModal(true);
    } else {
      hideModal();
    }
  };

  const closePreCancelModal = () => {
    setIsOpenPreCancelModal(false);
    hideModal();
  };

  const resumeEditingPermissions = () => {
    setIsOpenPreCancelModal(false);
  };

  return (
    <Modal
      id='manage-permissions-modal'
      variant={variant}
      isOpen={true}
      aria-label={t('permission.manage_permissions_dialog.aria_label')}
      position='top'
      title={title}
      showClose={true}
      aria-describedby='modal-message'
      onClose={closePermissionModal}
      onEscapePress={onEscapePress}
      actions={[
        <SubmitButton key={1} />,
        <Button onClick={closePermissionModal} key={2} variant='secondary'>
          {t('permission.manage_permissions_dialog.cancel_button')}
        </Button>,
      ]}
    >
      <PreCancelModal
        isOpen={isOpenPreCancelModal}
        closeModal={closePreCancelModal}
        resumeEditing={resumeEditingPermissions}
      />
      <ModalForm />
    </Modal>
  );
};

export default ManagePermissions;
