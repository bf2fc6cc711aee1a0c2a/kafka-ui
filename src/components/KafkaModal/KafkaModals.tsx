// A map of modal components to their lazy loaded implementations
import React from 'react';

import { useTranslation } from 'react-i18next';
import {
  ConsumerGroupResetOffsetProps,
  DeleteConsumerGroupProps,
  DeleteTopicProps,
  ManagePermissionsProps,
  ModalRegistry,
  ModalType,
  PartitionsChangeProps,
  useModal,
} from '@rhoas/app-services-ui-shared';

export const useKafkaModals = (): ModalRegistry => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  return {
    [ModalType.KafkaDeleteTopic]: {
      lazyComponent: React.lazy(
        () =>
          import(
            /* webpackPrefetch: true */ '@app/modules/Topics/dialogs/DeleteTopic/DeleteTopic'
          )
      ) as React.LazyExoticComponent<React.FunctionComponent<DeleteTopicProps>>,
      variant: 'small',
    },
    [ModalType.KafkaUpdatePartitions]: {
      lazyComponent: React.lazy(
        () =>
          import(
            /* webpackPrefetch: true */ '@app/modules/Topics/dialogs/PartitionsChange/PartitionsChange'
          )
      ) as React.LazyExoticComponent<
        React.FunctionComponent<PartitionsChangeProps>
      >,
      variant: 'small',
    },
    [ModalType.KafkaDeleteConsumerGroup]: {
      lazyComponent: React.lazy(
        () =>
          import(
            /* webpackPrefetch: true */ '@app/modules/ConsumerGroups/dialogs/DeleteConsumerGroup/DeleteConsumerGroup'
          )
      ) as React.LazyExoticComponent<
        React.FunctionComponent<DeleteConsumerGroupProps>
      >,
      variant: 'small',
    },
    [ModalType.KafkaConsumerGroupResetOffset]: {
      lazyComponent: React.lazy(
        () =>
          import(
            /* webpackPrefetch: true */ '@app/modules/ConsumerGroups/dialogs/ConsumerGroupResetOffset/ConsumerGroupResetOffset'
          )
      ) as React.LazyExoticComponent<
        React.FunctionComponent<ConsumerGroupResetOffsetProps>
      >,
      variant: 'large',
    },
    [ModalType.KafkaManagePermissions]: {
      lazyComponent: React.lazy(
        () =>
          import(
            /* webpackPrefetch: true */ '@app/modules/Permissions/dialogs/ManagePermissions/ManagePermissions'
          )
      ) as React.LazyExoticComponent<
        React.FunctionComponent<ManagePermissionsProps>
      >,
      variant: 'large',
      title: t('permission.manage_permissions_dialog.title'),
    },
  };
};

export const KafkaModalLoader: React.FunctionComponent = () => {
  const { registerModals } = useModal();
  const kafkaModals = useKafkaModals();
  registerModals(kafkaModals);
  return <></>;
};
