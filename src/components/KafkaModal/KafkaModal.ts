import {DeleteTopicProps, PartitionsChangeProps,} from '@app/modules/Topics/dialogs';
import {DeleteConsumerGroupProps} from '@app/modules/ConsumerGroups/dialogs';
import React from 'react';
import {BaseModalProps, createModalHooks} from "@app/components";

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

const factory = <T extends ModalType>() => {

  const lookupComponent = (modalType: T) => {
    return ModalTypeComponentsMap[modalType];
  }

  type ComponentMap = {
    [T in ModalType]: React.LazyExoticComponent<React.FunctionComponent<ModalTypePropsMap[T] & BaseModalProps>>
  }

// A map of modal components to their lazy loaded implementations
  const ModalTypeComponentsMap: ComponentMap = {
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


  return createModalHooks<T, ModalTypePropsMap[T]>(lookupComponent);
}

export const {
  ModalContext,
  ModalProvider,
  useModal
} = factory();
