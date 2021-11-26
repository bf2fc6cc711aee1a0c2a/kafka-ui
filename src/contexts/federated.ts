import React, { useContext } from 'react';
import { DeleteInstanceProps } from '@rhoas/app-services-ui-shared';

export type FederatedProps = Pick<DeleteInstanceProps, 'kafka'> & {
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
  redirectAfterDeleteInstance?: () => void;
  onDeleteInstance?: () => void;
};

export const FederatedContext = React.createContext<FederatedProps | undefined>(
  undefined
);
export const useFederated = (): FederatedProps | undefined =>
  useContext(FederatedContext);
