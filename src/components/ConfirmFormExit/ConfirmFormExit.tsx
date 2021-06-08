import React from 'react';
import { Modal, Button, ModalVariant } from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';

export type ConfirmFormExitProps = {
  exitFormModal: boolean;
  setExitFormModal: (value: boolean) => void;
};

export const ConfirmFormExit: React.FunctionComponent<ConfirmFormExitProps> = ({
  exitFormModal,
  setExitFormModal,
}) => {
  const history = useHistory();

  const onLeave = () => {
    history.push('/topics');
  };
  return (
    <>
      <Modal
        title='Leave Page?'
        variant={ModalVariant.small}
        isOpen={exitFormModal ? true : false}
        onClose={() => setExitFormModal(false)}
        actions={[
          <Button key='cancel' variant='link' onClick={onLeave}>
            Leave
          </Button>,
          <Button
            key='confirm'
            variant='primary'
            onClick={() => setExitFormModal(false)}
          >
            Stay
          </Button>,
        ]}
      >
        Changes you made to the topic properties will be lost
      </Modal>
    </>
  );
};
