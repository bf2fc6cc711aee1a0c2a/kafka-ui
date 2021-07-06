import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { useRootModalContext } from '@app/components/RootModal';

export const PartitionsChange: React.FC = () => {
  const { store, hideModal } = useRootModalContext();
  const { onSaveTopic } = store?.modalProps || {};

  const onClose = () => {
    hideModal();
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
        <Button variant='primary' onClick={onSaveTopic} key={1}>
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
