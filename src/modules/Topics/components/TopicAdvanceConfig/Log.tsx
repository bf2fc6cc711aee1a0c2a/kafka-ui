import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormSection,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import {
  FormGroupWithPopover,
  DropdownWithToggle,
  TextWithLabelPopover,
  IDropdownOption,
} from '@app/components';
import {
  DEFAULT_MINIMUM_COMPACTION_LAG_TIME,
  DEFAULT_DELETE_RETENTION_TIME,
  DEFAULT_MIN_CLEANBLE_RATIO,
} from '@app/constant';
import { IAdvancedTopic, kebabToDotSeparated } from '@app/modules/Topics/utils';

export type LogProps = {
  topicData: IAdvancedTopic;
  setTopicData: (data: IAdvancedTopic) => void;
};

const Log: React.FC<LogProps> = ({ topicData, setTopicData }) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  const cleanupPolicyOptions: IDropdownOption[] = [
    {
      key: 'compact',
      value: 'compact',
      label: t('common.compact'),
      isDisabled: false,
    },
    {
      key: 'delete',
      value: 'delete',
      label: t('common.delete'),
      isDisabled: false,
    },
    {
      key: 'compact-delete',
      value: 'compact,delete',
      label: `${t('common.compact')},${t('common.delete')}`,
      isDisabled: false,
    },
  ];

  const onSelectOption = (value: string, name: string) => {
    setTopicData({ ...topicData, [kebabToDotSeparated(name)]: value });
  };

  return (
    <FormSection title={t('topic.log')} id='log' titleElement={'h2'}>
      <TextContent>
        <Text component={TextVariants.p}>{t('topic.log_section_info')}</Text>
        <Text component={TextVariants.small}>
          {t('topic.log_section_info_note')}
        </Text>
      </TextContent>

      <FormGroupWithPopover
        fieldId='cleanup-policy'
        fieldLabel={t('topic.cleanup_policy')}
        labelHead={t('topic.cleanup_policy')}
        labelBody={t('topic.cleanup_policy_description')}
        buttonAriaLabel={t('topic.cleanup_policy')}
      >
        <DropdownWithToggle
          id='log-section-policy-type-dropdown'
          toggleId='log-section-policy-type-dropdowntoggle'
          ariaLabel={t('common.select_policy')}
          onSelectOption={onSelectOption}
          items={cleanupPolicyOptions}
          name='cleanup-policy'
          value={topicData['cleanup.policy'] || ''}
          isLabelAndValueNotSame={true}
        />
      </FormGroupWithPopover>

      <TextWithLabelPopover
        fieldId='delete-retention-time'
        btnAriaLabel={t('topic.delete_retention_time')}
        fieldLabel={t('topic.delete_retention_time')}
        fieldValue={DEFAULT_DELETE_RETENTION_TIME}
        popoverBody={t('topic.delete_retention_time_description')}
        popoverHeader={t('topic.delete_retention_time')}
      />

      <TextWithLabelPopover
        fieldId='min-cleanable-ratio'
        btnAriaLabel={t('topic.min_cleanable_ratio')}
        fieldLabel={t('topic.min_cleanable_ratio')}
        fieldValue={DEFAULT_MIN_CLEANBLE_RATIO}
        popoverBody={t('topic.min_cleanable_ratio_description')}
        popoverHeader={t('topic.min_cleanable_ratio')}
      />

      <TextWithLabelPopover
        fieldId='min-compaction-lag-time-description'
        btnAriaLabel={t('topic.min_compaction_lag_time')}
        fieldLabel={t('topic.min_compaction_lag_time')}
        fieldValue={DEFAULT_MINIMUM_COMPACTION_LAG_TIME}
        popoverBody={t('topic.min_compaction_lag_time_description')}
        popoverHeader={t('topic.min_compaction_lag_time')}
      />
    </FormSection>
  );
};

export { Log };
