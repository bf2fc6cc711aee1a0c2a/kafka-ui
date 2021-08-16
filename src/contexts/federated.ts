import React, { useContext } from 'react';

export type FederatedProps = {
  activeTab?: number;
  kafkaName?: string;
  kafkaPageLink?: string;
  kafkaInstanceLink?: string;
  topicName?: string;
  onError?: (errorCode: number, message?: string) => void;
  handleInstanceDrawer?: (isOpen: boolean, activeTab?: string) => void;
  setIsOpenDeleteInstanceModal?: (isOpenModal: boolean) => void;
  showMetrics?: JSX.Element | undefined;
  onClickCreateTopic?: () => void;
  onEditTopic?: (topicName: string | undefined) => void;
  onCancelUpdateTopic?: () => void;
  updateTopic?: (topicName?: string | undefined) => void;
};

const initialState: FederatedProps = {
  activeTab: 0,
  kafkaName: '',
  kafkaPageLink: '',
  kafkaInstanceLink: '',
  topicName: '',
  onError: () => '',
  handleInstanceDrawer: () => '',
  setIsOpenDeleteInstanceModal: () => '',
  showMetrics: undefined,
};

export const FederatedContext =
  React.createContext<FederatedProps>(initialState);
export const useFederated = (): FederatedProps => useContext(FederatedContext);
