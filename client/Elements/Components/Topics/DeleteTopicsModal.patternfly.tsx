/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, {useContext} from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Flex,
  Text,
  FlexItem,
} from '@patternfly/react-core';
import {deleteTopic} from '../../../Services/TopicServices'
import {ConfigContext} from 'Contexts';

export interface IDeleteTopics {
  setDeleteModal: (value: boolean) => void;
  deleteModal: boolean;
  topicName?: string;
}
export const DeleteTopics: React.FunctionComponent<IDeleteTopics> = ({
  setDeleteModal,
  deleteModal,
  topicName
}) => {
  const onClose = () => {
    setDeleteModal(false);
  };

  const config = useContext(ConfigContext)

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
    >
      <Text> The Topic will be deleted </Text>

      <br />
      <Flex>
        <FlexItem>
          <Button variant='danger' onClick={()=> {if (topicName) deleteTopic(topicName, config)}}>Delete Topic</Button>
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
