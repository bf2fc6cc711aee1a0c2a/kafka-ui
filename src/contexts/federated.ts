import React, { useContext } from 'react';

export type FederatedProps = {
  onConnectToRoute?: (routePath: string) => void;
  getConnectToRoutePath?: (routePath: string, key?: string) => string;
  activeTab?: number;
  kafkaName?: string;
  kafkaPageLink?: string;
  kafkaInstanceLink?: string;
  topicName?: string;
  onError?: (errorCode: number, message?: string) => void;
  handleInstanceDrawer?: (isOpen: boolean, activeTab?: string) => void;
  setIsOpenDeleteInstanceModal?: (isOpenModal: boolean) => void;
  dispatchKafkaAction?: (
    action: string,
    topicName?: string | undefined
  ) => void;
  showMetrics?: () => JSX.Element | string;
};

const initialState: FederatedProps = {
  onConnectToRoute: () => '',
  getConnectToRoutePath: () => '',
  activeTab: 0,
  kafkaName: '',
  kafkaPageLink: '',
  kafkaInstanceLink: '',
  topicName: '',
  onError: () => '',
  handleInstanceDrawer: () => '',
  setIsOpenDeleteInstanceModal: () => '',
  dispatchKafkaAction: () => '',
  showMetrics: () => '',
};

export const FederatedContext =
  React.createContext<FederatedProps>(initialState);
export const useFederated = (): FederatedProps => useContext(FederatedContext);
