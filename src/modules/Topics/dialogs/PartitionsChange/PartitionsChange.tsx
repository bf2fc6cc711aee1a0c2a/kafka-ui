import React from 'react';
import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import { BaseModalProps, PartitionsChangeProps } from '@app/components';

export const PartitionsChange: React.FC<
  PartitionsChangeProps & BaseModalProps
> = ({ hideModal, onSaveTopic }) => {
  const onClose = () => {
    hideModal();
  };

  const onConfirm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    onClose();
    onSaveTopic && onSaveTopic(event);
  };

  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={true}
      aria-label='Confirm change of partitions'
      title='Increase the number of partitions?'
      titleIconVariant='warning'
      showClose={true}
      aria-describedby='modal-message'
      onClose={onClose}
      actions={[
        <Button variant='primary' onClick={onConfirm} key={1}>
          Yes
        </Button>,
        <Button variant='link' onClick={onClose} key={2}>
          No, return to form
        </Button>,
      ]}
    >
      Messages might have the same key from two different partitions, which can
      potentially break the message ordering guarantees that apply to a single
      partition.
    </Modal>
  );
};

export default PartitionsChange;
