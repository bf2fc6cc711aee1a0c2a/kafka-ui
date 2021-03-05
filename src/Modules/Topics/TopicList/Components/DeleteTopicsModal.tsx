import React, { useContext } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Flex,
  Text,
  FlexItem,
} from '@patternfly/react-core';
import { deleteTopic } from '../../../../Services/TopicServices';
import { ConfigContext } from '../../../../Contexts';
import { useHistory } from 'react-router';
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
  const history = useHistory();
  const onClose = () => {
    setDeleteModal(false);
  };

  const onSave = () => {
    setDeleteModal(false);
    history.push('/topics');
  };

  const config = useContext(ConfigContext);

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
      <Text> The Topic will be deleted </Text>

      <br />
      <Flex>
        <FlexItem>
          <Button
            variant='danger'
            onClick={() => {
              if (topicName)
                deleteTopic(topicName, config).then(() => onSave());
            }}
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
