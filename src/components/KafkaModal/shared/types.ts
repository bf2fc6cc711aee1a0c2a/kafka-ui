import { ModalType, ModalTypePropsMap } from '@app/components/KafkaModal';
import React from 'react';
import { ModalProps } from '@patternfly/react-core';

export type ModalContextProps<T extends ModalType> = {
  registerModals: (modals: ModalRegistry) => void;
  showModal: (modalType: ModalType, modalProps: ModalTypePropsMap[T]) => void;
  hideModal: () => void;
};

export type ActiveModalProps<T extends ModalType> = {
  modalType: T;
  modalProps: ModalTypePropsMap[T];
};

// Properties available to all Modal components
export type BaseModalProps = {
  hideModal: () => void;
} & Pick<ModalProps, 'variant'> &
  Pick<ModalProps, 'title'>;

export type ModalRegistryEntry<T extends ModalType> = {
  lazyComponent: React.LazyExoticComponent<
    React.FunctionComponent<ModalTypePropsMap[T] & BaseModalProps>
  >;
} & Pick<ModalProps, 'variant'> &
  Pick<ModalProps, 'title'>;

export type ModalRegistry = {
  [T in ModalType]: ModalRegistryEntry<T>;
};
