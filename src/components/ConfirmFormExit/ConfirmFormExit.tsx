import React from 'react';
import { Modal, Button, ModalVariant } from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export type ConfirmFormExitProps = {
  exitFormModal: boolean;
  kafkaPageLink: string | undefined;
  kafkaPageLinkRedirect: boolean;
  setExitFormModal: (value: boolean) => void;
};

export const ConfirmFormExit: React.FunctionComponent<ConfirmFormExitProps> = ({
  exitFormModal,
  setExitFormModal,
  kafkaPageLinkRedirect,
  kafkaPageLink,
}) => {
  const history = useHistory();
  const { t } = useTranslation();

  const onLeave = () => {
    if (kafkaPageLinkRedirect)
      kafkaPageLink ? history.push(kafkaPageLink) : history.push('/topics');
    else history.push('/topics');
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
            {t('topic.leave')}
          </Button>,
          <Button
            key='confirm'
            variant='primary'
            onClick={() => setExitFormModal(false)}
          >
            {t('topic.stay')}
          </Button>,
        ]}
      >
        {t('topic.changes_lost')}
      </Modal>
    </>
  );
};
