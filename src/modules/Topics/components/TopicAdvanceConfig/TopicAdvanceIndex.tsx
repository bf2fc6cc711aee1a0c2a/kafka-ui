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
  DEFAULT_INDEX_INTERVAL_SIZE,
  DEFAULT_SEGMENT_INDEX_SIZE,
} from '@app/constant';

const TopicAdvanceIndex: React.FC = () => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  return (
    <FormSection title={t('topic.index')} id='index' titleElement={'h2'}>
      <TextContent>
        <Text component={TextVariants.p} className='section-info'>
          {t('topic.index_section_info')}
        </Text>
      </TextContent>

      <TextWithLabelPopover
        fieldId='index-interval-size'
        btnAriaLabel={t('topic.index_interval_size')}
        fieldLabel={t('topic.index_interval_size')}
        fieldValue={DEFAULT_INDEX_INTERVAL_SIZE}
        popoverBody={t('topic.index_interval_size_description')}
        popoverHeader={t('topic.index_interval_size')}
      />

      <TextWithLabelPopover
        fieldId='segment-index-size'
        btnAriaLabel={t('topic.segment_index_size')}
        fieldLabel={t('topic.segment_index_size')}
        fieldValue={DEFAULT_SEGMENT_INDEX_SIZE}
        popoverBody={t('topic.segment_index_size_description')}
        popoverHeader={t('topic.segment_index_size')}
      />
    </FormSection>
  );
};

export { TopicAdvanceIndex };
