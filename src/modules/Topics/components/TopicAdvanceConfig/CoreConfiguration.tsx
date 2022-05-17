import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormSection,
  TextContent,
  Text,
  TextVariants,
  TextInput,
  NumberInput,
  Stack,
  Radio,
  ValidatedOptions,
} from '@patternfly/react-core';
import { FormGroupWithPopover, TextWithLabelPopover } from '@app/components';
import { CustomRetentionMessage } from '@app/modules/Topics/components';
import {
  IAdvancedTopic,
  RetentionSizeUnits,
  RetentionTimeUnits,
  kebabToCamel,
  useValidateTopic,
  unitsToBytes as RetentionSizeUnitToValue,
  RetentionTimeUnitToValue,
  retentionTimeSelectOptions,
  retentionSizeSelectOptions,
} from '@app/modules/Topics/utils';
import { MAX_PARTITIONS } from '@app/constant';
import { useFederated } from '@app/contexts';

export type CoreConfigurationProps = {
  isCreate?: boolean;
  topicData: IAdvancedTopic;
  setTopicData: (data: IAdvancedTopic) => void;
  fetchTopic: (topic: string) => void;
  initialPartition: number | undefined;
  invalidText: string;
  setInvalidText: (message: string) => void;
  setTopicValidated: (error: ValidatedOptions) => void;
  topicValidated: ValidatedOptions;
  setWarning: (isWarning: boolean) => void;
  warning: boolean;
};

const CoreConfiguration: React.FC<CoreConfigurationProps> = ({
  isCreate,
  topicData,
  setTopicData,
  fetchTopic,
  initialPartition,
  invalidText,
  setInvalidText,
  setTopicValidated,
  topicValidated,
  setWarning,
  warning,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const { validateName } = useValidateTopic();
  const { replicationFactor, minInSyncReplicas } = useFederated() || {};

  //states
  const [partitionsValidated, setPartitionsValidated] =
    useState<ValidatedOptions>(ValidatedOptions.default);
  const [isRetentionTimeSelectOpen, setIsRetentionTimeSelectOpen] =
    useState<boolean>();
  const [isRetentionSizeSelectOpen, setIsRetentionSizeSelectOpen] =
    useState<boolean>();

  const validationCheck = useCallback(
    (value: string) => {
      const errorMessage = validateName(value);
      if (errorMessage) {
        setInvalidText(errorMessage);
        setTopicValidated(ValidatedOptions.error);
      } else {
        setTopicValidated(ValidatedOptions.default);
      }
    },
    [setInvalidText, setTopicValidated, validateName]
  );

  //use effects
  useEffect(() => {
    if (!isCreate) {
      fetchTopic(topicData.name);
    }
    validationCheck(topicData.name);
  }, [fetchTopic, isCreate, topicData.name, validationCheck]);

  const partitionsWarnigCheck = (operator: string) => {
    let value: number | undefined;
    if (operator === '+') {
      value = Number(topicData.numPartitions) + 1;
    } else if (operator === '-') {
      value = Number(topicData.numPartitions) - 1;
    }

    if (value) {
      if (initialPartition && value > initialPartition) {
        setPartitionsValidated(ValidatedOptions.warning);
        setWarning(true);
      } else {
        setPartitionsValidated(ValidatedOptions.default);
        setWarning(false);
      }
    }
  };

  const handleRetentionMessageSize = (value: string) => {
    setTopicData({
      ...topicData,
      'retention.bytes':
        value === RetentionSizeUnits.UNLIMITED ||
        value === RetentionSizeUnits.CUSTOM
          ? topicData['retention.bytes']
          : `${
              RetentionSizeUnitToValue[
                value as keyof typeof RetentionSizeUnitToValue
              ]
            }`,
      selectedRetentionSizeOption: value,
    });
  };

  const onRetentionTimeToggle = (isOpen: boolean) => {
    setIsRetentionTimeSelectOpen(isOpen);
  };

  const onRetentionSizeToggle = (isOpen: boolean) => {
    setIsRetentionSizeSelectOpen(isOpen);
  };

  const handleRetentionMessageTime = (value: string) => {
    setTopicData({
      ...topicData,
      'retention.ms':
        value === RetentionTimeUnits.UNLIMITED ||
        value === RetentionTimeUnits.CUSTOM
          ? topicData['retention.ms']
          : `${
              RetentionTimeUnitToValue[
                value as keyof typeof RetentionTimeUnitToValue
              ]
            }`,
      selectedRetentionTimeOption: value,
    });
  };

  const handleTextInputChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    validationCheck(value);
    const { name: fieldName } = event.currentTarget;
    setTopicData({ ...topicData, [kebabToCamel(fieldName)]: value });
  };

  const onPartitionsChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { name: fieldName, value } = event.currentTarget;
    let partitionValue = Number(value);
    if (initialPartition) {
      if (partitionValue > initialPartition) {
        setPartitionsValidated(ValidatedOptions.warning);
        setWarning(true);
      }

      if (partitionValue < initialPartition) {
        partitionValue = initialPartition;
        setPartitionsValidated(ValidatedOptions.default);
        setWarning(false);
      } else if (partitionValue > MAX_PARTITIONS) {
        partitionValue = MAX_PARTITIONS;
      }
    }
    setTopicData({ ...topicData, [kebabToCamel(fieldName)]: partitionValue });
  };

  const handleTouchSpin = (name: string, operator: string) => {
    let value;
    const fieldName = kebabToCamel(name) as keyof IAdvancedTopic;

    if (operator === '+') {
      value = Number(topicData[fieldName]) + 1;
    } else if (operator === '-') {
      value = Number(topicData[fieldName]) - 1;
    }

    setTopicData({
      ...topicData,
      [fieldName]: value,
    });

    if (!isCreate) {
      partitionsWarnigCheck(operator);
    }
  };

  const retentionTimeInput = (
    <CustomRetentionMessage
      toggleId='core-config-retention-dropdowntoggle'
      name='retention-ms'
      topicData={topicData}
      setTopicData={setTopicData}
      onToggle={onRetentionTimeToggle}
      isOpen={isRetentionTimeSelectOpen}
      selectOptions={retentionTimeSelectOptions}
    />
  );

  const retentionSizeInput = (
    <CustomRetentionMessage
      toggleId='core-config-retention-size-dropdowntoggle'
      name='retention-bytes'
      topicData={topicData}
      setTopicData={setTopicData}
      onToggle={onRetentionSizeToggle}
      isOpen={isRetentionSizeSelectOpen}
      selectOptions={retentionSizeSelectOptions}
    />
  );

  return (
    <FormSection
      title={t('topic.core_configuration')}
      id='core-configuration'
      titleElement={'h2'}
    >
      <TextContent>
        <Text component={TextVariants.p} className='section-info'>
          {t('topic.core_config_info')}
        </Text>
      </TextContent>
      {isCreate ? (
        <FormGroupWithPopover
          labelHead={t('topic.topic_name')}
          fieldId='create-topic-name'
          fieldLabel={t('topic.topic_name')}
          labelBody={t('topic.topic_name_description')}
          buttonAriaLabel='More info for topic name field'
          helperTextInvalid={invalidText}
          validated={topicValidated}
          isRequired={true}
          helperText={t('topic.topic_name_helper_text')}
        >
          <TextInput
            isRequired
            type='text'
            id='create-topic-name'
            name='name'
            value={topicData.name}
            onChange={handleTextInputChange}
            label={t('topic.topic_name')}
            placeholder={t('topic.enter_name')}
            validated={topicValidated}
          />
        </FormGroupWithPopover>
      ) : (
        <TextWithLabelPopover
          fieldId='topic-name'
          btnAriaLabel='topic detail name'
          fieldLabel='Name'
          fieldValue={topicData.name}
          popoverBody={t('topic.topic_name_description')}
          popoverHeader={t('topic.topic_name')}
        />
      )}

      <FormGroupWithPopover
        fieldId='create-topic-partitions'
        fieldLabel='Partitions'
        labelHead={t('topic.partitions')}
        labelBody={t('topic.partitions_description')}
        buttonAriaLabel='More info for partitions field'
        validated={partitionsValidated}
        helperText={warning ? t('topic.partitions_warning') : undefined}
      >
        <NumberInput
          id='create-topic-partitions'
          inputName='num-partitions'
          onChange={onPartitionsChange}
          onPlus={() => handleTouchSpin('num-partitions', '+')}
          onMinus={() => handleTouchSpin('num-partitions', '-')}
          value={Number(topicData.numPartitions)}
          plusBtnProps={{ name: 'num-partitions' }}
          minusBtnProps={{ name: 'num-partitions' }}
          min={initialPartition}
          max={MAX_PARTITIONS}
        />
      </FormGroupWithPopover>

      <TextWithLabelPopover
        fieldId='replicas'
        btnAriaLabel={t('topic.replicas')}
        fieldLabel={t('topic.replicas')}
        fieldValue={
          isCreate ? replicationFactor?.toString() : topicData.replicationFactor
        }
        popoverBody={t('topic.replicas_description')}
        popoverHeader={t('topic.replicas')}
      />
      <TextWithLabelPopover
        fieldId='min-insync-replicas'
        btnAriaLabel='topic detail min-in-sync replica'
        fieldLabel='Minimum in-sync replicas'
        fieldValue={minInSyncReplicas?.toString()}
        popoverBody={t('topic.min_insync_replicas_description')}
        popoverHeader={t('topic.min_insync_replicas')}
      />
      <FormGroupWithPopover
        fieldId='retention'
        fieldLabel='Retention time'
        labelHead={t('topic.retention_time')}
        labelBody={t('topic.retention_time_description')}
        buttonAriaLabel='More info for retention time field'
      >
        <Stack hasGutter>
          <Radio
            isChecked={
              topicData.selectedRetentionTimeOption ===
                RetentionTimeUnits.DAY ||
              topicData.selectedRetentionTimeOption ===
                RetentionTimeUnits.WEEK ||
              topicData.selectedRetentionTimeOption ===
                RetentionTimeUnits.CUSTOM
            }
            name='custom-retention-time'
            onChange={() =>
              handleRetentionMessageTime(RetentionTimeUnits.CUSTOM)
            }
            label={retentionTimeInput}
            className='kafka-ui--radio-label__number-input'
            aria-label='custom duration'
            id='custom-retention-time'
            value={RetentionTimeUnits.CUSTOM}
          />
          <Radio
            isChecked={
              topicData.selectedRetentionTimeOption ===
              RetentionTimeUnits.UNLIMITED
            }
            name='unlimited-retention-time'
            onChange={() =>
              handleRetentionMessageTime(RetentionTimeUnits.UNLIMITED)
            }
            label='Unlimited'
            aria-label='Unlimited'
            id='unlimited-retention-time'
            value={RetentionTimeUnits.UNLIMITED}
          />
        </Stack>
      </FormGroupWithPopover>
      <FormGroupWithPopover
        fieldId='retention-size'
        fieldLabel='Retention size'
        labelHead={t('topic.retention_size')}
        labelBody={t('topic.retention_size_description')}
        buttonAriaLabel='More info for retention size field'
      >
        <Stack hasGutter>
          <Radio
            isChecked={
              topicData.selectedRetentionSizeOption ===
              RetentionSizeUnits.CUSTOM
            }
            name='custom-retention-size'
            onChange={() =>
              handleRetentionMessageSize(RetentionSizeUnits.CUSTOM)
            }
            label={retentionSizeInput}
            className='kafka-ui--radio-label__number-input'
            aria-label='custom size'
            id='custom-retention-size'
            value={RetentionSizeUnits.CUSTOM}
          />
          <Radio
            isChecked={
              topicData.selectedRetentionSizeOption ===
              RetentionSizeUnits.UNLIMITED
            }
            name='unlimited-retention-size'
            onChange={() =>
              handleRetentionMessageSize(RetentionSizeUnits.UNLIMITED)
            }
            label='Unlimited'
            aria-label='Unlimited'
            id='unlimited-retention-size'
            value={RetentionSizeUnits.UNLIMITED}
          />
        </Stack>
      </FormGroupWithPopover>
    </FormSection>
  );
};

export { CoreConfiguration };
