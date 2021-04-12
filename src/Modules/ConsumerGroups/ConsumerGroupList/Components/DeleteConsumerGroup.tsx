import React, { useContext, useState } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Text,
  AlertVariant,
  TextInput,
} from '@patternfly/react-core';
import { deleteConsumerGroup } from '../../../../Services/ConsumerGroupsServices';
import { ConfigContext } from '../../../../Contexts';
import { AlertContext } from '../../../../Contexts/Alert/Context';
export interface IDeleteConsumer {
  setDeleteModal: (value: boolean) => void;
  deleteModal: boolean;
  consumerName?: string;
  onDeleteConsumer: () => void;
}
export const DeleteConsumerGroup: React.FunctionComponent<IDeleteConsumer> = ({
  setDeleteModal,
  deleteModal,
  consumerName,
  onDeleteConsumer,
}) => {
  const [verificationText, setVerificationText] = useState<string>('');
  const { addAlert } = useContext(AlertContext);
  const onClose = () => {
    setDeleteModal(false);
  };

  const onDelete = async () => {
    try {
      consumerName && (await deleteConsumerGroup(consumerName, config));
      addAlert(
        `Successfully deleted consumer group ${consumerName}`,
        AlertVariant.success
      );
    } catch (err) {
      addAlert(err.response.data.err, AlertVariant.danger);
    }
    onDeleteConsumer();
    setDeleteModal(false);
  };

  const config = useContext(ConfigContext);

  const handleVerificationTextChange = (value) => {
    setVerificationText(value);
  };

  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={deleteModal}
      aria-label='Delete consumer group?'
      title='Delete Consumer Group?'
      titleIconVariant='warning'
      showClose={true}
      aria-describedby='modal-message'
      onClose={onClose}
      actions={[
        <Button
          variant='danger'
          onClick={onDelete}
          key={1}
          isDisabled={verificationText.toUpperCase() != 'DELETE'}
        >
          Delete
        </Button>,
        <Button variant='link' onClick={onClose} key={2}>
          Cancel
        </Button>,
      ]}
    >
      <Text id='modal-message'>
        <b>{consumerName}</b> will be deleted.{' '}
      </Text>

      <br />
      <label htmlFor='delete-text-input'>Type DELETE to confirm:</label>
      <TextInput
        value={verificationText}
        id='delete-text-input'
        name='delete-text-input'
        type='text'
        onChange={handleVerificationTextChange}
        autoFocus={true}
      />
    </Modal>
  );
};
