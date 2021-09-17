import React from 'react';
import { ConsumerGroup } from '@rhoas/kafka-instance-sdk';
import { EnhancedAclBinding } from '@app/services/acls';

// The available types of modal
export enum ModalType {
  KafkaDeleteTopic = 'KafkaDeleteTopic',
  KafkaDeleteConsumerGroup = 'KafkaDeleteConsumerGroup',
  KafkaUpdatePartitions = 'KafkaUpdatePartitions',
  KafkaConsumerGroupResetOffset = 'KafkaConsumerGroupResetOffset',
  KafkaManagePermissions = 'KafkaManagePermissions',
}

export type DeleteTopicProps = {
  topicName?: string;
  onDeleteTopic?: () => void;
  refreshTopics?: () => void;
};

export type PartitionsChangeProps = {
  onSaveTopic: React.MouseEventHandler<HTMLButtonElement>;
};

export type DeleteConsumerGroupProps = {
  consumerName: string;
  refreshConsumerGroups?: () => void;
  state?: string;
};

export type ConsumerGroupResetOffsetProps = {
  consumerGroupData: ConsumerGroup | undefined;
  refreshConsumerGroups?: () => void;
};

export type ManagePermissionsProps = {
  onSave?: () => Promise<void>;
  kafkaName?: string;
  topicNames: string[];
  consumerGroupIds: string[];
  selectedAccountId?: string;
  acls: Array<EnhancedAclBinding>;
};

// A map of modal types to their props
export interface ModalTypePropsMap {
  [ModalType.KafkaDeleteTopic]: DeleteTopicProps;
  [ModalType.KafkaUpdatePartitions]: PartitionsChangeProps;
  [ModalType.KafkaDeleteConsumerGroup]: DeleteConsumerGroupProps;
  [ModalType.KafkaConsumerGroupResetOffset]: ConsumerGroupResetOffsetProps;
  [ModalType.KafkaManagePermissions]: ManagePermissionsProps;
}

export type ManagePermissionsModalProps = ManagePermissionsProps & {
  resourceOperations: { [key: string]: Array<string> } | undefined;
  hideModal: () => void;
};
