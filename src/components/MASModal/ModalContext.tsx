import React, {createContext, useContext, useState} from 'react';
import {MASLoading} from '@app/components';

import {Modal} from "@patternfly/react-core";
import {ModalTypePropsMap} from "@app/components/KafkaModal/KafkaModal";

export type ModalContextPropsBase<MT, MP> = {
  showModal: (modalType: MT, modalProps: MP) => void;
  hideModal: () => void;
}

export type ActiveModalPropsBase<MT, MP> = {
  modalType: MT;
  modalProps: MP;
}

export type ModalPropsBase<MT, MP> = {
  activeModal?: ActiveModalPropsBase<MT, MP>;
  hideModal: () => void;
};

export type ModalHooks<MT, MP> = {
  ModalContext: React.Context<ModalContextPropsBase<MT, MP> | undefined>
  useModal:<T extends MT>() => ModalContextPropsBase<T, MP>
  ModalProvider: React.FunctionComponent
}

// Properties available to all Modal components
export type BaseModalProps = {
  id: string;
  hideModal: () => void;
};


export const createModalHooks = <MT, MP>(componentLookup: (modalType: MT) => React.LazyExoticComponent<React.FunctionComponent<any>>): ModalHooks<MT, MP> => {
  const [activeModal, setActiveModal] = useState<ActiveModalPropsBase<MT, MP> | undefined>();

  const modalProps: ModalContextPropsBase<MT, MP> = {
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

  const ModalContext = createContext<ModalContextPropsBase<MT, MP> | undefined>(undefined);

  const useModal = <T extends MT>(): ModalContextPropsBase<T, MP> => {
    return (
      useContext(ModalContext) ||
      ({
        hideModal: Function.prototype,
        showModal: Function.prototype,
      } as ModalContextPropsBase<T, MP>)
    );
  };

  const Modal: React.FunctionComponent = () => {

    if (activeModal === undefined) {
      return <></>;
    }

    const ModalComponent = componentLookup(activeModal.modalType);
    return (
      <React.Suspense fallback={<MASLoading/>}>
        <ModalComponent
          hideModal={modalProps.hideModal}
          id='root-modal'
          {...activeModal.modalProps}
        />
      </React.Suspense>
    );
  };

  const ModalProvider: React.FunctionComponent = ({children}) => {



    return (
      <>
        <Modal />
        <ModalContext.Provider value={modalProps}>
          {children}
        </ModalContext.Provider>
      </>
    );
  }
  return {
    ModalContext,
    useModal,
    ModalProvider
  }
  };
