import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';

export interface IPartitionsChangeModal {
  onSaveClick: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}
export const PartitionsChangeModal: React.FunctionComponent<IPartitionsChangeModal> = ({
  onSaveClick,
  isOpen,
  setIsOpen,
}) => {
  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={isOpen}
      aria-label='Confirm change of partitions'
      title='Increase the number of partitions?'
      titleIconVariant='warning'
      showClose={true}
      aria-describedby='modal-message'
      onClose={() => setIsOpen(false)}
      actions={[
        <Button variant='primary' onClick={onSaveClick} key={1}>
          Yes
        </Button>,
        <Button variant='link' onClick={() => setIsOpen(false)} key={2}>
          No,return to form
        </Button>,
      ]}
    >
      Messages might the same key from two different partitions,which can
      potentially break the message ordering guarantees that apply to a single
      partition
    </Modal>
  );
};
