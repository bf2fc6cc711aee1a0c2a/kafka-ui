import React, { createContext, useContext, useState } from 'react';
import { MASLoading } from '@app/components';
import {
  BaseModalProps,
  ModalType,
  ModalTypeComponentsMap,
  ModalTypePropsMap,
} from '@app/components/KafkaModal/ModalTypes';

export type ModalContextProps<T extends ModalType> = {
  showModal: (modalType: T, modalProps?: ModalTypePropsMap[T]) => void;
  hideModal: () => void;
};

type ActiveModalProps<T extends ModalType> = {
  modalType: T;
  modalProps: ModalTypePropsMap[T];
};

type ModalProps = {
  activeModal?: ActiveModalProps<ModalType>;
  hideModal: () => void;
};

export const ModalContext = createContext<
  ModalContextProps<ModalType> | undefined
>(undefined);

export const useModal = <T extends ModalType>(): ModalContextProps<T> => {
  return (
    useContext(ModalContext) ||
    ({
      hideModal: Function.prototype,
      showModal: Function.prototype,
    } as ModalContextProps<T>)
  );
};

const Modal: React.FunctionComponent<ModalProps> = ({
  activeModal,
  hideModal,
}) => {
  const loadModal = <T extends ModalType>(
    modalType: T
  ): React.LazyExoticComponent<
    React.FunctionComponent<ModalTypePropsMap[T] & BaseModalProps>
  > => {
    return ModalTypeComponentsMap[modalType] as React.LazyExoticComponent<
      React.FunctionComponent<ModalTypePropsMap[T] & BaseModalProps>
    >;
  };

  if (activeModal === undefined) {
    return <></>;
  }

  const ModalComponent = loadModal(activeModal.modalType);
  return (
    <React.Suspense fallback={<MASLoading />}>
      <ModalComponent
        hideModal={hideModal}
        id='root-modal'
        {...activeModal.modalProps}
      />
    </React.Suspense>
  );
};

export const ModalProvider: React.FunctionComponent = ({ children }) => {
  const [activeModal, setActiveModal] = useState<
    ActiveModalProps<ModalType> | undefined
  >();

  const modalProps: ModalContextProps<any> = {
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
      <Modal activeModal={activeModal} hideModal={modalProps.hideModal} />
      <ModalContext.Provider value={modalProps}>
        {children}
      </ModalContext.Provider>
    </>
  );
};
