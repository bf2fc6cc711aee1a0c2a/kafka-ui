import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Modal,
  ModalVariant,
  Text,
} from '@patternfly/react-core';
import { deleteConsumerGroup } from '@app/services';
import { ConfigContext } from '@app/contexts';
import { ConsumerGroupStateEnum } from '@rhoas/kafka-instance-sdk';
import { isAxiosError } from '@app/utils/axios';
import { BaseModalProps, DeleteConsumerGroupProps } from '@app/components';
import { useAlert } from '@rhoas/app-services-ui-shared';

const DeleteConsumerGroup: React.FC<DeleteConsumerGroupProps & BaseModalProps> =
  ({ consumerName, refreshConsumerGroups, hideModal, state }) => {
    const { t } = useTranslation();
    const config = useContext(ConfigContext);
    const { addAlert } = useAlert() || {
      addAlert: () => {
        // No-op
      },
    };
    const isConsumerConnected = state === ConsumerGroupStateEnum.Stable;

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
        let message: string | undefined;
        if (err && isAxiosError(err)) {
          message = err.response?.data.error_message;
        }
        addAlert({
          variant: AlertVariant.danger,
          title: message || '',
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
            isDisabled={isConsumerConnected}
          >
            {t('common.delete')}
          </Button>,
          <Button variant='link' onClick={onClose} key={2}>
            {t('common.cancel')}
          </Button>,
        ]}
      >
        {!isConsumerConnected && (
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
        )}
        {isConsumerConnected && (
          <Alert
            className='modal-alert'
            variant='danger'
            isInline
            title={t('consumerGroup.delete_consumer_connected_alert_title', {
              name: consumerName,
            })}
          >
            <p>{t('consumerGroup.delete_consumer_connected_alert_body')}</p>
          </Alert>
        )}
      </Modal>
    );
  };

export default DeleteConsumerGroup;
