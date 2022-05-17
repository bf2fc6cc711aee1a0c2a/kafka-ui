import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Text,
  TextContent,
  TextVariants,
  Form,
  FormSection,
} from '@patternfly/react-core';
import '../CreateTopicWizard/CreateTopicWizard.css';
import { TextWithLabelPopover } from '@app/components/TextWithLabelPopover';

export type StepReplicasProps = {
  replicationFactor: number;
  minInSyncReplica: number;
  isMultiAZ: boolean | undefined;
};

export const StepReplicas: React.FC<StepReplicasProps> = ({
  replicationFactor,
  minInSyncReplica,
  isMultiAZ,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  return (
    <Form>
      <FormSection
        title={t('common.replicas')}
        id='replica-section'
        titleElement={'h2'}
      >
        <TextContent>
          <Text component={TextVariants.p}>{t('topic.replicas_info')}</Text>
          <Text component={TextVariants.small}>
            {t('topic.replicas_detail')}
          </Text>
        </TextContent>
        <Alert
          variant='info'
          isInline
          title={
            isMultiAZ
              ? t('topic.replicas_helper_text_multi_az')
              : t('topic.replicas_helper_text_single_az')
          }
        />

        <TextWithLabelPopover
          fieldId='replicas'
          btnAriaLabel={t('common.replicas')}
          fieldLabel={t('common.replicas')}
          fieldValue={replicationFactor.toString()}
          popoverBody={t('topic.replicas_description')}
          popoverHeader={t('topic.replicas')}
        />

        <TextWithLabelPopover
          fieldId='min-insync-replicas'
          btnAriaLabel='topic detail min-in-sync replica'
          fieldLabel='Minimum in-sync replicas'
          fieldValue={minInSyncReplica.toString()}
          popoverBody={t('topic.min_insync_replicas_description')}
          popoverHeader={t('topic.min_insync_replicas')}
        />
      </FormSection>
    </Form>
  );
};
