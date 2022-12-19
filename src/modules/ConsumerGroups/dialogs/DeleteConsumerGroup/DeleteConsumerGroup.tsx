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
import { isAxiosError } from '@app/utils/axios';
import {
  BaseModalProps,
  DeleteConsumerGroupProps,
  ModalType,
  useAlert,
} from '@rhoas/app-services-ui-shared';
import {
  DeleteConsumerGroup,
  ConsumerGroupState,
} from '@rhoas/app-services-ui-components';

const ConsumerGroupDelete: React.FC<
  DeleteConsumerGroupProps & BaseModalProps
> = ({ consumerName, refreshConsumerGroups, hideModal, state }) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const config = useContext(ConfigContext);
  const { addAlert } = useAlert() || {
    addAlert: () => {
      // No-op
    },
  };

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
    <DeleteConsumerGroup
      isModalOpen={true}
      consumerName={consumerName}
      state={state as ConsumerGroupState}
      onDeleteConsumer={onDelete}
      onClose={onClose}
      appendTo={() => document.body}
    />
  );
};
