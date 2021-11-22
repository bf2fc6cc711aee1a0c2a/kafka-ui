import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Form,
  FormGroup,
  FormSection,
  Radio,
  Stack,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { CustomRetentionMessage } from '@app/modules/Topics/components';
import {
  IAdvancedTopic,
  RetentionTimeUnits,
  RetentionSizeUnits,
  unitsToBytes as RetentionSizeUnitToValue,
  RetentionTimeUnitToValue,
  retentionTimeSelectOptions,
  retentionSizeSelectOptions,
} from '@app/modules/Topics/utils';
import '../CreateTopicWizard/CreateTopicWizard.css';

export type StepMessageRetentionProps = {
  topicData: IAdvancedTopic;
  setTopicData: (topic: IAdvancedTopic) => void;
};

export const StepMessageRetention: React.FC<StepMessageRetentionProps> = ({
  topicData,
  setTopicData,
}) => {
  const { t } = useTranslation();

  const [isRetentionTimeSelectOpen, setIsRetentionTimeSelectOpen] =
    useState<boolean>(false);
  const [isRetentionSizeSelectOpen, setIsRetentionSizeSelectOpen] =
    useState<boolean>(false);

  const handleRetentionMessageTime = (value: string) => {
    setTopicData({
      ...topicData,
      'retention.ms':
        value === RetentionTimeUnits.UNLIMITED ||
        value === RetentionTimeUnits.CUSTOM
          ? topicData['retention.ms']
          : RetentionTimeUnitToValue[value],
      selectedRetentionTimeOption: value,
    });
  };

  const handleRetentionMessageSize = (value: string) => {
    setTopicData({
      ...topicData,
      'retention.bytes':
        value === RetentionSizeUnits.UNLIMITED ||
        value === RetentionSizeUnits.CUSTOM
          ? topicData['retention.bytes']
          : RetentionSizeUnitToValue[value],
      selectedRetentionSizeOption: value,
    });
  };

  const onRetentionTimeToggle = (isOpen: boolean) => {
    setIsRetentionTimeSelectOpen(isOpen);
  };

  const onRetentionSizeToggle = (isOpen: boolean) => {
    setIsRetentionSizeSelectOpen(isOpen);
  };

  const preventFormSubmit = (event) => event.preventDefault();

  return (
    <>
      <Form onSubmit={preventFormSubmit}>
        <FormSection
          title={t('topic.message_retention')}
          id='message-retention'
          titleElement={'h2'}
        >
          <TextContent>
            <Text component={TextVariants.p}>
              {t('topic.message_retention_info')}
            </Text>
            <Text component={TextVariants.small}>
              {t('topic.message_retention_info_note')}
            </Text>
          </TextContent>

          <FormGroup
            fieldId='form-group-retention-time-in-wizard'
            label={t('topic.retention_time')}
          >
            <Stack hasGutter>
              <Radio
                isChecked={
                  topicData.selectedRetentionTimeOption ===
                  RetentionTimeUnits.DAY
                }
                name='radioDay'
                onChange={() =>
                  handleRetentionMessageTime(RetentionTimeUnits.DAY)
                }
                label='A day'
                aria-label='A day'
                id='radio-controlled-1'
                value={RetentionTimeUnits.DAY}
              />
              <Radio
                isChecked={
                  topicData.selectedRetentionTimeOption ===
                  RetentionTimeUnits.WEEK
                }
                name='radioWeek'
                onChange={() =>
                  handleRetentionMessageTime(RetentionTimeUnits.WEEK)
                }
                label='A week'
                aria-label='A week'
                id='radio-controlled-2'
                value={RetentionTimeUnits.WEEK}
              />
              <Radio
                isChecked={
                  topicData.selectedRetentionTimeOption ===
                  RetentionTimeUnits.CUSTOM
                }
                name='radioCustomTime'
                onChange={() =>
                  handleRetentionMessageTime(RetentionTimeUnits.CUSTOM)
                }
                label='Custom duration'
                aria-label='custom input'
                id='radio-controlled-4'
                value={RetentionTimeUnits.CUSTOM}
              />
              {topicData.selectedRetentionTimeOption ===
                RetentionTimeUnits.CUSTOM && (
                <CustomRetentionMessage
                  name='retention-ms'
                  topicData={topicData}
                  setTopicData={setTopicData}
                  onToggle={onRetentionTimeToggle}
                  isOpen={isRetentionTimeSelectOpen}
                  selectOptions={retentionTimeSelectOptions}
                />
              )}
              <Radio
                isChecked={
                  topicData.selectedRetentionTimeOption ===
                  RetentionTimeUnits.UNLIMITED
                }
                name='radioUnlimitedTime'
                onChange={() =>
                  handleRetentionMessageTime(RetentionTimeUnits.UNLIMITED)
                }
                label='Unlimited'
                aria-label='Unlimited'
                id='radio-controlled-3'
                value={RetentionTimeUnits.UNLIMITED}
              />
            </Stack>
          </FormGroup>
          <FormGroup
            fieldId='form-group-retention-size-in-wizard'
            label='Retention size'
          >
            <Stack hasGutter>
              <Radio
                isChecked={
                  topicData.selectedRetentionSizeOption ===
                  RetentionSizeUnits.UNLIMITED
                }
                name='radioUnlimitedSize'
                onChange={() =>
                  handleRetentionMessageSize(RetentionSizeUnits.UNLIMITED)
                }
                label='Unlimited'
                aria-label='Unlimited'
                id='radio-controlled-6'
                value={RetentionSizeUnits.UNLIMITED}
              />
              <Radio
                isChecked={
                  topicData.selectedRetentionSizeOption ===
                  RetentionSizeUnits.CUSTOM
                }
                name='radioCustomSize'
                onChange={() =>
                  handleRetentionMessageSize(RetentionSizeUnits.CUSTOM)
                }
                label='Custom size'
                aria-label='custom input'
                id='radio-controlled-5'
                value={RetentionSizeUnits.CUSTOM}
              />
              {topicData.selectedRetentionSizeOption ===
                RetentionSizeUnits.CUSTOM && (
                <CustomRetentionMessage
                  name='retention-bytes'
                  topicData={topicData}
                  setTopicData={setTopicData}
                  onToggle={onRetentionSizeToggle}
                  isOpen={isRetentionSizeSelectOpen}
                  selectOptions={retentionSizeSelectOptions}
                />
              )}
            </Stack>
          </FormGroup>
        </FormSection>
      </Form>
    </>
  );
};
