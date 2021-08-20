import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalVariant,
  Button,
  Text,
  AlertVariant,
  ButtonVariant
} from '@patternfly/react-core';
import { deleteConsumerGroup } from '@app/services';
import { ConfigContext } from '@app/contexts';
import { useAlert } from '@bf2/ui-shared';
import { BaseModalProps } from '@app/components/KafkaModal/ModalTypes';

export type DeleteConsumerGroupProps = {
  consumerName: string;
  refreshConsumerGroups?: () => void;
};

const DeleteConsumerGroup: React.FC<DeleteConsumerGroupProps & BaseModalProps> =
  ({ consumerName, refreshConsumerGroups, hideModal }) => {
    const { t } = useTranslation();
    const config = useContext(ConfigContext);
    const { addAlert } = useAlert();

    const onClose = () => {
      hideModal();
    };

    const onDelete = async () => {
      try {
        if (consumerName) {
          await deleteConsumerGroup(consumerName, config).then(() => {
            addAlert({
              variant: AlertVariant.success,
              title: t('consumerGroup.consumergroup_successfully_deleted', {
                name: consumerName,
              }),
            });

            refreshConsumerGroups && refreshConsumerGroups();
          });
        }
      } catch (err) {
        addAlert({
          variant: AlertVariant.danger,
          title: err.response.data.error_message,
        });
      }
      onClose();
    };

 
    return (
      <Modal
        variant={ModalVariant.small}
        isOpen={true}
        aria-label={t('consumerGroup.delete')}
        title={t('consumerGroup.delete')}
        showClose={true}
        aria-describedby='modal-message'
        onClose={onClose}
        actions={[
          <Button
            variant={ButtonVariant.primary}
            onClick={onDelete}
            key={1}
          >
            {t('common.delete')}
          </Button>,
          <Button variant='link' onClick={onClose} key={2}>
            {t('common.cancel')}
          </Button>,
        ]}
      >
        <Text id='modal-message'>
          <label
            htmlFor='instance-name-input'
            dangerouslySetInnerHTML={{
              __html: t('common.confirm_delete_modal_text', {
                name: consumerName,
              }),
            }}
          />
        </Text>
      </Modal>
    );
  };

export default DeleteConsumerGroup;
