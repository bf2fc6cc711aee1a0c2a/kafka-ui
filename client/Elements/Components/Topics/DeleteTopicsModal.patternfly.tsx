/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Flex,
  Text,
  FlexItem,
} from '@patternfly/react-core';
export interface IDeleteTopics {
  setDeleteModal: (value: boolean) => void;
  deleteModal: boolean;
}
export const DeleteTopics: React.FunctionComponent<IDeleteTopics> = ({
  setDeleteModal,
  deleteModal,
}) => {
  const onClose = () => {
    setDeleteModal(false);
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
    >
      <Text> The Topic will be deleted </Text>

      <br />
      <Flex>
        <FlexItem>
          <Button variant='danger'>Delete Topic</Button>
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
