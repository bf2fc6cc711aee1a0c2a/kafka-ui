import React, { useContext } from 'react';

export type FederatedProps = {
    onConnectToRoute?: (routePath: string) => void;
    getConnectToRoutePath?: (routePath: string, key?: string) => string;
    activeTab?: number;
    kafkaName?: string;
    kafkaPageLink?: string;
    kafkaInstanceLink?: string;
    topicName?: string;
    addAlert?: (message: string, variant?: any) => void;
    onError?: (errorCode: number, message?: string) => void;
    handleInstanceDrawer?: (isOpen: boolean, activeTab?: string) => void;
    setIsOpenDeleteInstanceModal?: (isOpenModal: boolean) => void;
    dispatchKafkaAction?: (action: string) => void;
}

const initialState: FederatedProps = {
  onConnectToRoute: () => "",
  getConnectToRoutePath: () => "",
  activeTab: 0,
  kafkaName: "",
  kafkaPageLink: "",
  kafkaInstanceLink: "",
  topicName: "",
  addAlert: () => "",
  onError: () => "",
  handleInstanceDrawer: () => "",
  setIsOpenDeleteInstanceModal: () => "",
  dispatchKafkaAction: () => ""
};

export const FederatedContext = React.createContext<FederatedProps>(initialState);
export const useFederated = (): FederatedProps => useContext(FederatedContext);