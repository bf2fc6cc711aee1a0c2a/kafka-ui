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
  showSchemas?: JSX.Element | undefined;
};

export const FederatedContext = React.createContext<FederatedProps | undefined>(
  undefined
);
export const useFederated = (): FederatedProps | undefined =>
  useContext(FederatedContext);
