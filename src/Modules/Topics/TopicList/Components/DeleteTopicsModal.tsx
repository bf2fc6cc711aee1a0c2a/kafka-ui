import React, { useContext, useState } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Text,
  AlertVariant,
  TextInput,
  TextVariants,
  TextContent,
} from '@patternfly/react-core';
import { deleteTopic } from '../../../../Services/TopicServices';
import { ConfigContext } from '../../../../Contexts';
import { useHistory } from 'react-router';
import { AlertContext } from '../../../../Contexts/Alert/Context';
export interface IDeleteTopics {
  setDeleteModal: (value: boolean) => void;
  deleteModal: boolean;
  topicName?: string;
}
export const DeleteTopics: React.FunctionComponent<IDeleteTopics> = ({
  setDeleteModal,
  deleteModal,
  topicName,
}) => {
  const [verificationText, setVerificationText] = useState<string>('');
  const { addAlert } = useContext(AlertContext);
  const history = useHistory();
  const onClose = () => {
    setDeleteModal(false);
  };

  const onDelete = async () => {
    try {
      topicName && (await deleteTopic(topicName, config));
      addAlert(`Successfully deleted topic ${topicName}`, AlertVariant.success);
    } catch (err) {
      addAlert(err.response.data.err, AlertVariant.danger);
    }
    history.push('/topics');
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
      aria-label='Modal warning'
      title=' Delete topic  ?'
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
        {' '}
        <b>{topicName}</b> will be deleted.{' '}
      </Text>

      <br />
      <TextContent>
        <Text component={TextVariants.h6}> Type DELETE to confirm: </Text>
      </TextContent>
      <TextInput
        value={verificationText}
        type='text'
        onChange={handleVerificationTextChange}
        aria-label='text input example'
        autoFocus={true}
      />
    </Modal>
  );
};
