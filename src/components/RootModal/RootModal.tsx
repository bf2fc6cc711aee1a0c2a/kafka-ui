import React, { useState, createContext, useContext } from "react";
import { DeleteTopic, PartitionsChange } from "@app/modules/Topics/dialogs";
import { DeleteConsumerGroup } from "@app/modules/ConsumerGroups/dialogs";

export const MODAL_TYPES = {
  DELETE_TOPIC: "DELETE_TOPIC",
  DELETE_CONSUMER_GROUP: "DELETE_CONSUMER_GROUP",
  UPDATE_PARTITIONS: "UPDATE_PARTITIONS",
};

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.DELETE_TOPIC]: DeleteTopic,
  [MODAL_TYPES.DELETE_CONSUMER_GROUP]: DeleteConsumerGroup,
  [MODAL_TYPES.UPDATE_PARTITIONS]: PartitionsChange,
};

type RootModalContext = {
  showModal: (modalType: string, modalProps?: any) => void;
  hideModal: () => void;
  store: any;
};

const initalState: RootModalContext = {
  showModal: () => "",
  hideModal: () => "",
  store: "",
};

const RootModalContext = createContext(initalState);
export const useRootModalContext = (): RootModalContext =>
  useContext(RootModalContext);

export const RootModal: React.FC = ({ children }) => {
  const [store, setStore] = useState<any>();
  const { modalType, modalProps } = store || { modalType: "", modalProps: "" };

  const showModal = (modalType: string, modalProps: any) => {
    const newState = Object.assign({}, store);
    setStore({
      newState,
      modalType,
      modalProps,
    });
  };

  const hideModal = () => {
    const newState = Object.assign({}, store);
    setStore({
      newState,
      modalType: null,
      modalProps: "",
    });
  };

  const renderComponent = () => {
    const ModalComponent = MODAL_COMPONENTS[modalType];
    if (!modalType || !ModalComponent) {
      return null;
    }
    return <ModalComponent id="root-modal" {...modalProps} />;
  };

  return (
    <RootModalContext.Provider value={{ store, showModal, hideModal }}>
      {renderComponent()}
      {children}
    </RootModalContext.Provider>
  );
};
