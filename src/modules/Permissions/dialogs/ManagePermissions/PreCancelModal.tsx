import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalVariant,
  Button,
  ButtonVariant,
} from '@patternfly/react-core';

export type PreCancelModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  resumeEditing: () => void;
};

const PreCancelModal: React.FC<PreCancelModalProps> = ({
  isOpen,
  closeModal,
  resumeEditing,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  return (
    <Modal
      id='manage-permissions-precancel-modal'
      variant={ModalVariant.small}
      isOpen={isOpen}
      aria-label={t(
        'permission.manage_permissions_pre_cancel_dialog.aria_label'
      )}
      title={`${t(
        'permission.manage_permissions_pre_cancel_dialog.discard_changes'
      )}?`}
      titleIconVariant='warning'
      showClose={true}
      aria-describedby='modal-message'
      onClose={closeModal}
      onEscapePress={closeModal}
      actions={[
        <Button onClick={closeModal} key={1} variant={ButtonVariant.primary}>
          {t('permission.manage_permissions_pre_cancel_dialog.discard_changes')}
        </Button>,
        <Button
          onClick={resumeEditing}
          key={2}
          variant={ButtonVariant.secondary}
        >
          {t('permission.manage_permissions_pre_cancel_dialog.resume_editing')}
        </Button>,
      ]}
    >
      {t('permission.manage_permissions_pre_cancel_dialog.modal_description')}
    </Modal>
  );
};

export { PreCancelModal };
