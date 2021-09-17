import React, {
  createContext,
  MutableRefObject,
  useContext,
  useRef,
  useState,
} from 'react';
import { MASLoading, ModalRegistryEntry } from '@app/components';
import {
  ActiveModalProps,
  ModalContextProps,
  ModalRegistry,
} from '@app/components/KafkaModal/shared/types';
import { ModalType } from '@app/components/KafkaModal/shared/modals';
import { Modal, ModalProps } from '@patternfly/react-core';

export const ModalContext = createContext<
  ModalContextProps<ModalType> | undefined
>(undefined);

export const useModal = <T extends ModalType>(): ModalContextProps<T> => {
  const answer = useContext(ModalContext);
  if (answer === undefined) {
    throw new Error('not inside modal provider');
  }
  return answer;
};

type ModalWrapperProps<T extends ModalType> = {
  activeModal?: ActiveModalProps<T>;
  hideModal: () => void;
  modalRegistry: MutableRefObject<ModalRegistry>;
};

type FallbackModalProps<T extends ModalType> = Pick<ModalProps, 'variant'> &
  Pick<ModalWrapperProps<T>, 'hideModal'> &
  Pick<ModalProps, 'title'>;

const FallbackModal: React.FunctionComponent<FallbackModalProps<ModalType>> = ({
  variant,
  hideModal,
  title,
}) => {
  return (
    <Modal
      id='fallback-modal'
      variant={variant}
      isOpen={true}
      aria-label={'fallback modal'}
      showClose={true}
      aria-describedby='modal-message'
      onClose={hideModal}
      title={title}
    >
      <MASLoading
        bullseyeProps={{
          className: 'pf-u-p-xl',
        }}
      />
    </Modal>
  );
};

const ModalWrapper: React.FunctionComponent<ModalWrapperProps<ModalType>> = ({
  activeModal,
  hideModal,
  modalRegistry,
}) => {
  if (activeModal === undefined) {
    return <></>;
  }

  const entry = modalRegistry.current[
    activeModal.modalType
  ] as ModalRegistryEntry<ModalType>;

  const ModalComponent = entry.lazyComponent;
  return (
    <React.Suspense
      fallback={
        <FallbackModal
          hideModal={hideModal}
          variant={entry.variant}
          title={entry.title}
        />
      }
    >
      <ModalComponent
        hideModal={hideModal}
        title={entry.title}
        variant={entry.variant}
        {...activeModal.modalProps}
      />
    </React.Suspense>
  );
};

export const ModalProvider: React.FunctionComponent = ({ children }) => {
  const [activeModal, setActiveModal] = useState<
    ActiveModalProps<ModalType> | undefined
  >();
  const modalRegistry = useRef<ModalRegistry>({} as ModalRegistry);

  const modalProps: ModalContextProps<ModalType> = {
    registerModals: (modals) => {
      modalRegistry.current = { ...modalRegistry, ...modals };
    },

    hideModal: () => {
      setActiveModal(undefined);
    },

    showModal: (modalType, modalProps) => {
      setActiveModal({
        modalType,
        modalProps,
      });
    },
  };

  return (
    <>
      <ModalWrapper
        activeModal={activeModal}
        hideModal={modalProps.hideModal}
        modalRegistry={modalRegistry}
      />
      <ModalContext.Provider value={modalProps}>
        {children}
      </ModalContext.Provider>
    </>
  );
};
