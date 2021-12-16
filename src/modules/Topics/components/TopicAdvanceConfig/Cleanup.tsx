import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormSection,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { TextWithLabelPopover } from '@app/components';
import {
  DEFAULT_LOG_SEGMENT_SIZE,
  DEFAULT_SEGMENT_TIME,
  DEFAULT_SEGMENT_JITTER_TIME,
  DEFAULT_FILE_DELETE_DELAY,
} from '@app/constant';

const Cleanup: React.FC = () => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  return (
    <FormSection title={t('common.cleanup')} id='cleanup' titleElement={'h2'}>
      <TextContent>
        <Text component={TextVariants.p} className='section-info'>
          {t('topic.cleanup_section_info')}
        </Text>
      </TextContent>

      <TextWithLabelPopover
        fieldId='log-segment-size'
        btnAriaLabel={t('topic.log_segment_size')}
        fieldLabel={t('topic.log_segment_size')}
        fieldValue={DEFAULT_LOG_SEGMENT_SIZE}
        popoverBody={t('topic.log_segment_size')}
        popoverHeader={t('topic.log_segment_size_description')}
      />

      <TextWithLabelPopover
        fieldId='segement-time'
        btnAriaLabel={t('topic.segement_time')}
        fieldLabel={t('topic.segement_time')}
        fieldValue={DEFAULT_SEGMENT_TIME}
        popoverBody={t('topic.segement_time_description')}
        popoverHeader={t('topic.segement_time')}
      />

      <TextWithLabelPopover
        fieldId='segment-jitter-time'
        btnAriaLabel={t('topic.segment_jitter_time')}
        fieldLabel={t('topic.segment_jitter_time')}
        fieldValue={DEFAULT_SEGMENT_JITTER_TIME}
        popoverBody={t('topic.segment_jitter_time_description')}
        popoverHeader={t('topic.segment_jitter_time')}
      />

      <TextWithLabelPopover
        fieldId='file-delete-delay'
        btnAriaLabel={t('topic.file_delete_delay')}
        fieldLabel={t('topic.file_delete_delay')}
        fieldValue={DEFAULT_FILE_DELETE_DELAY}
        popoverBody={t('topic.file_delete_delay_description')}
        popoverHeader={t('topic.file_delete_delay')}
      />

      <TextWithLabelPopover
        fieldId='preallocate-log-segment-files'
        btnAriaLabel={t('topic.preallocate_log_segment_files')}
        fieldLabel={t('topic.preallocate_log_segment_files')}
        fieldValue={t('common.disabled')}
        popoverBody={t('topic.preallocate_log_segment_files_description')}
        popoverHeader={t('topic.preallocate_log_segment_files')}
      />
    </FormSection>
  );
};

export { Cleanup };
