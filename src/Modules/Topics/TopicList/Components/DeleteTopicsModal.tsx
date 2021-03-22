import React, { useContext, useState } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Flex,
  Text,
  FlexItem,
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
  const [verificationText, setVerificationText] = useState('');
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
      aria-label='Modal warning example'
      title=' Delete Topic  ?'
      titleIconVariant='warning'
      showClose={true}
      aria-describedby='no-header-example'
      onClose={onClose}
      // onClick={onSave}
    >
      <Text>
        {' '}
        The Topic <b>{topicName}</b> will be deleted forever.{' '}
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
      />
      <br />
      <br />
      <Flex>
        <FlexItem>
          <Button
            variant='danger'
            onClick={onDelete}
            isDisabled={verificationText.toUpperCase() != 'DELETE'}
          >
            Delete Topic
          </Button>
        </FlexItem>
        <FlexItem>
          <Button variant='link' onClick={onClose}>
            Cancel
          </Button>
        </FlexItem>
      </Flex>
    </Modal>
  );
};
