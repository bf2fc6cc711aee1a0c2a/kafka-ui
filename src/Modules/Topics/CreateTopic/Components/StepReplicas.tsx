import React from 'react';
import {
  Alert,
  Stack,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import './CreateTopicWizard.css';
import { TextWithLabelPopover } from '../../../../Components/TextWithLabelPopover/TextWithLabelPopover';
import { useTranslation } from 'react-i18next';

export interface IStepReplicas {
  replicationFactor: number;
  minInSyncReplica: number;
}

export const StepReplicas: React.FC<IStepReplicas> = ({
  replicationFactor,
  minInSyncReplica,
}) => {
  const { t } = useTranslation();

  return (
    <Stack hasGutter className='kafka-ui--wizard-main-body__stack'>
      <TextContent>
        <Text component={TextVariants.h2}>Replicas</Text>
        <Text component={TextVariants.p}>
          How many copies of a topic will be made for high availability.
        </Text>
        <Text component={TextVariants.small}>
          The partitions of each topic can be replicated across a configurable
          number of brokers.
        </Text>
      </TextContent>
      <Alert
        variant='info'
        isInline
        title='Streams for Apache Kafka only supports 3 replicas and a minimum in-sync replica factor of 2.'
      />
      <TextWithLabelPopover
        btnAriaLabel='topic detail replicas'
        fieldLabel='Replicas'
        fieldValue={replicationFactor.toString()}
        popoverBody={t('createTopic.replicasLabelBody')}
        popoverHeader={t('createTopic.replicasLabelHead')}
      />

      <TextWithLabelPopover
        btnAriaLabel='topic detail min-in-sync replica'
        fieldLabel='Minimum in-sync replicas'
        fieldValue={minInSyncReplica.toString()}
        popoverBody={t('createTopic.inSyncReplicasLabelBody')}
        popoverHeader={t('createTopic.inSyncReplicasLabelHead')}
      />
    </Stack>
  );
};
