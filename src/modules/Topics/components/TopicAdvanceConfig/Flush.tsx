import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormSection,
  TextVariants,
  TextContent,
  Text,
} from '@patternfly/react-core';
import { TextWithLabelPopover } from '@app/components';
import {
  DEFAULT_FLUSH_INTERVAL_MESSAGES,
  DEFAULT_FLUSH_INTERVAL_TIME,
} from '@app/constant';

const Flush: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FormSection title={t('topic.flush')} id='flush' titleElement={'h2'}>
      <TextContent>
        <Text component={TextVariants.p} className='section-info'>
          {t('topic.flush_section_info')}
        </Text>
      </TextContent>

      <TextWithLabelPopover
        fieldId='flush-interval-messages'
        btnAriaLabel={t('topic.flush_interval_messages')}
        fieldLabel={t('topic.flush_interval_messages')}
        fieldValue={DEFAULT_FLUSH_INTERVAL_MESSAGES}
        popoverBody={t('topic.flush_interval_messages_description')}
        popoverHeader={t('topic.flush_interval_messages')}
      />

      <TextWithLabelPopover
        fieldId='flush-interval-time'
        btnAriaLabel={t('topic.flush_interval_time')}
        fieldLabel={t('topic.flush_interval_time')}
        fieldValue={DEFAULT_FLUSH_INTERVAL_TIME}
        popoverBody={t('topic.flush_interval_time_description')}
        popoverHeader={t('topic.flush_interval_time')}
      />
    </FormSection>
  );
};

export { Flush };
