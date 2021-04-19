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
        <Text component={TextVariants.h2}>{t('common.replicas')}</Text>
        <Text component={TextVariants.p}>
          {t('createTopic.stepReplicasInfo')}
        </Text>
        <Text component={TextVariants.small}>
          {t('createTopic.stepReplicasDetail')}
        </Text>
      </TextContent>
      <Alert
        variant='info'
        isInline
        title={t('createTopic.stepReplicasHelperText')}
      />
      <TextWithLabelPopover
        btnAriaLabel={t('common.replicas')}
        fieldLabel={t('common.replicas')}
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
