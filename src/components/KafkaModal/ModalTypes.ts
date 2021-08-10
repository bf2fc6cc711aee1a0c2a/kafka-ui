import {
  DeleteTopicProps,
  PartitionsChangeProps,
} from '@app/modules/Topics/dialogs';
import { DeleteConsumerGroupProps } from '@app/modules/ConsumerGroups/dialogs';
import React from 'react';

// The available types of modal
export enum ModalType {
  DeleteTopic,
  DeleteConsumerGroup,
  UpdatePartitions,
}

// A map of modal types to their props
export interface ModalTypePropsMap {
  [ModalType.DeleteTopic]: DeleteTopicProps;
  [ModalType.UpdatePartitions]: PartitionsChangeProps;
  [ModalType.DeleteConsumerGroup]: DeleteConsumerGroupProps;
}

// Properties available to all Modal components
export type BaseModalProps = {
  id: string;
  hideModal: () => void;
};

// A map of modal components to their lazy loaded implementations
export const ModalTypeComponentsMap: {
  [T in ModalType]: React.LazyExoticComponent<
    React.FunctionComponent<ModalTypePropsMap[T] & BaseModalProps>
  >;
} = {
  [ModalType.DeleteTopic]: React.lazy(
    () => import('@app/modules/Topics/dialogs/DeleteTopic/DeleteTopic')
  ) as React.LazyExoticComponent<React.FunctionComponent<DeleteTopicProps>>,
  [ModalType.UpdatePartitions]: React.lazy(
    () =>
      import('@app/modules/Topics/dialogs/PartitionsChange/PartitionsChange')
  ) as React.LazyExoticComponent<
    React.FunctionComponent<PartitionsChangeProps>
  >,
  [ModalType.DeleteConsumerGroup]: React.lazy(
    () =>
      import(
        '@app/modules/ConsumerGroups/dialogs/DeleteConsumerGroup/DeleteConsumerGroup'
      )
  ) as React.LazyExoticComponent<
    React.FunctionComponent<DeleteConsumerGroupProps>
  >,
};
