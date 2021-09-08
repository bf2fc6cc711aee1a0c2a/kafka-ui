import {
  DeleteTopicProps,
  PartitionsChangeProps,
} from '@app/modules/Topics/dialogs';
import { DeleteConsumerGroupProps } from '@app/modules/ConsumerGroups/dialogs';
import React from 'react';
import { ConsumerGroupResetOffsetProps } from '@app/modules/ConsumerGroups/dialogs/ConsumerGroupResetOffset';
import { ManagePermissionsProps } from '@app/modules/Permissions/dialogs/ManagePermissions/ManagePermissions';

// The available types of modal
export enum ModalType {
  DeleteTopic,
  DeleteConsumerGroup,
  UpdatePartitions,
  ConsumerGroupResetOffset,
  ManagePermissions,
}

// A map of modal types to their props
export interface ModalTypePropsMap {
  [ModalType.DeleteTopic]: DeleteTopicProps;
  [ModalType.UpdatePartitions]: PartitionsChangeProps;
  [ModalType.DeleteConsumerGroup]: DeleteConsumerGroupProps;
  [ModalType.ConsumerGroupResetOffset]: ConsumerGroupResetOffsetProps;
  [ModalType.ManagePermissions]: ManagePermissionsProps;
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
  [ModalType.ConsumerGroupResetOffset]: React.lazy(
    () =>
      import(
        '@app/modules/ConsumerGroups/dialogs/ConsumerGroupResetOffset/ConsumerGroupResetOffset'
      )
  ) as React.LazyExoticComponent<
    React.FunctionComponent<ConsumerGroupResetOffsetProps>
  >,
  [ModalType.ManagePermissions]: React.lazy(
    () =>
      import(
        /* webpackPrefetch: true */ '@app/modules/Permissions/dialogs/ManagePermissions/ManagePermissions'
      )
  ) as React.LazyExoticComponent<
    React.FunctionComponent<ManagePermissionsProps>
  >,
};
