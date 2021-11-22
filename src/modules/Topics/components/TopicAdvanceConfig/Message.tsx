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
  DEFAULT_MAXIMUM_MESSAGE_BYTES,
  DEFAULT_MESSAGE_TIMESTAMP_TYPE,
  DEFAULT_MAX_MESSAGE_TIMESTAMP_DIFF,
} from '@app/constant';

const Message: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FormSection title={t('topic.messages')} id='messages' titleElement={'h2'}>
      <TextContent>
        <Text component={TextVariants.p} className='section-info'>
          {t('topic.message_section_info')}
        </Text>
      </TextContent>

      <TextWithLabelPopover
        fieldId='max-message-size'
        btnAriaLabel={t('topic.max_message_size')}
        fieldLabel={t('topic.max_message_size')}
        fieldValue={DEFAULT_MAXIMUM_MESSAGE_BYTES}
        popoverBody={t('topic.max_message_size_description')}
        popoverHeader={t('topic.max_message_size')}
      />

      <TextWithLabelPopover
        fieldId='message-timestamp-type'
        btnAriaLabel={t('topic.message_timestamp_type')}
        fieldLabel={t('topic.message_timestamp_type')}
        fieldValue={DEFAULT_MESSAGE_TIMESTAMP_TYPE}
        popoverBody={t('topic.message_timestamp_type_description')}
        popoverHeader={t('topic.message_timestamp_type')}
      />

      <TextWithLabelPopover
        fieldId='max-message-timestamp-diff'
        btnAriaLabel={t('topic.max_message_timestamp_diff')}
        fieldLabel={t('topic.max_message_timestamp_diff')}
        fieldValue={DEFAULT_MAX_MESSAGE_TIMESTAMP_DIFF}
        popoverBody={t('topic.max_message_timestamp_diff_description')}
        popoverHeader={t('topic.max_message_timestamp_diff')}
      />

      <TextWithLabelPopover
        fieldId='compression-type'
        btnAriaLabel={t('topic.compression_type')}
        fieldLabel={t('topic.compression_type')}
        fieldValue={'Producer'}
        popoverBody={t('topic.compression_type_description')}
        popoverHeader={t('topic.compression_type')}
      />

      <TextWithLabelPopover
        fieldId='message-format'
        btnAriaLabel={t('topic.message_format')}
        fieldLabel={t('topic.message_format')}
        fieldValue={'2.7-IV2'}
        popoverBody={t('topic.message_format_description')}
        popoverHeader={t('topic.message_format')}
      />
    </FormSection>
  );
};

export { Message };
