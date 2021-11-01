import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  FormSection,
  NumberInput,
  Radio,
  Select,
  SelectOption,
  SelectVariant,
  Stack,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { IAdvancedTopic } from '@app/modules/Topics/components';
import { kebabToDotSeparated } from '@app/modules/Topics/utils';
import '../CreateTopicWizard/CreateTopicWizard.css';

export type StepMessageRetentionProps = {
  setMsgRetentionValue: (value: number) => void;
  currentPeriod: string | number;
  currentSize: string | number;
  setCurrentPeriod: (value: string | number) => void;
  setCurrentSize: (value: string | number) => void;
  setRetentionSize: (value: number) => void;
  topicData: IAdvancedTopic;
  setTopicData: (topic: IAdvancedTopic) => void;
};

export const StepMessageRetention: React.FC<StepMessageRetentionProps> = ({
  setMsgRetentionValue,
  currentPeriod,
  currentSize,
  setCurrentPeriod,
  setCurrentSize,
  setRetentionSize,
  topicData,
  setTopicData,
}) => {
  const { t } = useTranslation();

  enum RetentionTimeOption {
    MILLISECOND = 1,
    SECOND = 1000,
    MINUTE = 60000,
    HOUR = 3600000,
    DAY = 86400000,
    WEEK = 604800000,
    CUSTOM = 'custom',
    UNLIMITED = -1,
  }

  enum RetentionSizeOption {
    BYTE = 1,
    KIBIBYTE = 1024,
    MEBIBYTE = 1048576,
    GIBIBYTE = 1073741824,
    TEBIBYTE = 1.0995116e12,
    CUSTOM = 'custom',
    UNLIMITED = -1,
  }
  const [retentionTimeTouchspinValue] = useState<number>(7);
  const [retentionSizeTouchspinValue] = useState<number>(1);
  const [isRetentionTimeSelectOpen, setIsRetentionTimeSelectOpen] =
    useState<boolean>(false);
  const [isRetentionSizeSelectOpen, setIsRetentionSizeSelectOpen] =
    useState<boolean>(false);
  const [setSelectedTime] = useState<boolean>(false);
  const [setSelectedSize] = useState<boolean>(false);
  const [retentionTimeFactor, setRetentionTimeFactor] = useState<number>(
    RetentionTimeOption.DAY
  );
  const [retentionSizeFactor, setRetentionSizeFactor] = useState<number>(
    RetentionSizeOption.BYTE
  );

  useEffect(() => {
    if (currentPeriod === RetentionTimeOption.DAY) {
      setMsgRetentionValue(RetentionTimeOption.DAY);
    } else if (currentPeriod === RetentionTimeOption.WEEK) {
      setMsgRetentionValue(RetentionTimeOption.WEEK);
    } else if (currentPeriod === RetentionTimeOption.UNLIMITED) {
      setMsgRetentionValue(RetentionTimeOption.UNLIMITED);
    } else if (currentPeriod === RetentionTimeOption.CUSTOM) {
      setMsgRetentionValue(retentionTimeFactor * retentionTimeTouchspinValue);
    }

    if (currentSize === RetentionSizeOption.UNLIMITED) {
      setRetentionSize(RetentionSizeOption.UNLIMITED);
    } else if (currentSize === RetentionSizeOption.CUSTOM) {
      setRetentionSize(retentionSizeFactor * retentionSizeTouchspinValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPeriod,
    currentSize,
    retentionTimeTouchspinValue,
    retentionSizeTouchspinValue,
    retentionTimeFactor,
    retentionSizeFactor,
  ]);

  const handleMessageRetention = (_, event) => {
    const target = event.target;
    const name = target.name;

    if (name === 'radioDay') {
      setCurrentPeriod(RetentionTimeOption.DAY);
    } else if (name === 'radioWeek') {
      setCurrentPeriod(RetentionTimeOption.WEEK);
    } else if (name === 'radioUnlimitedTime') {
      setCurrentPeriod(RetentionTimeOption.UNLIMITED);
    } else if (name === 'radioCustomTime') {
      setCurrentPeriod(RetentionTimeOption.CUSTOM);
    }

    if (name === 'radioCustomSize') {
      setCurrentSize(RetentionSizeOption.CUSTOM);
    } else if (name === 'radioUnlimitedSize') {
      setCurrentSize(RetentionSizeOption.UNLIMITED);
    }
  };

  const onRetentionTimeToggle = (isRetentionTimeSelectOpen) => {
    setIsRetentionTimeSelectOpen(isRetentionTimeSelectOpen);
  };

  const onRetentionSizeToggle = (isRetentionSizeSelectOpen) => {
    setIsRetentionSizeSelectOpen(isRetentionSizeSelectOpen);
  };

  const onRetentionTimeSelect = (event, selection) => {
    if (selection === 'days') {
      setRetentionTimeFactor(RetentionTimeOption.DAY);
    } else if (selection === 'unlimited') {
      setRetentionTimeFactor(RetentionTimeOption.UNLIMITED);
    } else if (selection === 'milliseconds') {
      setRetentionTimeFactor(RetentionTimeOption.MILLISECOND);
    } else if (selection === 'seconds') {
      setRetentionTimeFactor(RetentionTimeOption.SECOND);
    } else if (selection === 'minutes') {
      setRetentionTimeFactor(RetentionTimeOption.MINUTE);
    } else if (selection === 'hours') {
      setRetentionTimeFactor(RetentionTimeOption.HOUR);
    }
    setSelectedTime(selection);
    setIsRetentionTimeSelectOpen(false);
  };

  const onRetentionSizeSelect = (event, selection) => {
    if (selection === 'unlimited') {
      setRetentionSizeFactor(RetentionSizeOption.UNLIMITED);
    } else if (selection === 'bytes') {
      setRetentionSizeFactor(RetentionSizeOption.BYTE);
    } else if (selection === 'kibibytes') {
      setRetentionSizeFactor(RetentionSizeOption.KIBIBYTE);
    } else if (selection === 'mebibytes') {
      setRetentionSizeFactor(RetentionSizeOption.MEBIBYTE);
    } else if (selection === 'gibibytes') {
      setRetentionSizeFactor(RetentionSizeOption.GIBIBYTE);
    } else if (selection === 'tebibytes') {
      setRetentionSizeFactor(RetentionSizeOption.TEBIBYTE);
    }
    setSelectedSize(selection);
    setIsRetentionSizeSelectOpen(false);
  };

  const handleTouchSpinPlus = (event) => {
    const { name } = event?.currentTarget;
    const fieldName = kebabToDotSeparated(name);
    setTopicData({
      ...topicData,
      [fieldName]: Number(topicData[fieldName]) + 1,
    });
  };

  const handleTouchSpinMinus = (event) => {
    const { name } = event?.currentTarget;
    const fieldName = kebabToDotSeparated(name);
    setTopicData({
      ...topicData,
      [fieldName]: Number(topicData[fieldName]) - 1,
    });
  };

  const handleTouchSpinChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    const truncValue = Math.trunc(Number(value)).toString();
    const fieldName = kebabToDotSeparated(name);
    setTopicData({
      ...topicData,
      [fieldName]: truncValue,
    });
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
                isChecked={currentPeriod === RetentionTimeOption.DAY}
                name='radioDay'
                onChange={handleMessageRetention}
                label='A day'
                aria-label='A day'
                id='radio-controlled-1'
                value='day'
              />
              <Radio
                isChecked={currentPeriod === RetentionTimeOption.WEEK}
                name='radioWeek'
                onChange={handleMessageRetention}
                label='A week'
                aria-label='A week'
                id='radio-controlled-2'
                value='week'
              />
              <Radio
                isChecked={currentPeriod === RetentionTimeOption.CUSTOM}
                name='radioCustomTime'
                onChange={handleMessageRetention}
                label='Custom duration'
                aria-label='custom input'
                id='radio-controlled-4'
                value='custom'
              />
              {currentPeriod === RetentionTimeOption.CUSTOM && (
                <div className='kafka-ui--radio__parameters'>
                  <Flex>
                    <FlexItem>
                      <NumberInput
                        name='retention-ms'
                        onMinus={handleTouchSpinMinus}
                        onPlus={handleTouchSpinPlus}
                        value={Number(topicData['retention.ms'])}
                        onChange={handleTouchSpinChange}
                        plusBtnProps={{ name: 'retention-ms' }}
                        minusBtnProps={{ name: 'retention-ms' }}
                        min={0}
                      />
                    </FlexItem>
                    <FlexItem>
                      <Select
                        variant={SelectVariant.single}
                        aria-label='Select Input'
                        onToggle={onRetentionTimeToggle}
                        onSelect={onRetentionTimeSelect}
                        selections={topicData['retention.ms.unit']}
                        isOpen={isRetentionTimeSelectOpen}
                      >
                        <SelectOption key={0} value='days' isPlaceholder />
                        <SelectOption key={1} value='seconds' />
                        <SelectOption key={2} value='minutes' />
                        <SelectOption key={3} value='hours' />
                        <SelectOption key={4} value='milliseconds' />
                      </Select>
                    </FlexItem>
                  </Flex>
                </div>
              )}
              <Radio
                isChecked={currentPeriod === RetentionTimeOption.UNLIMITED}
                name='radioUnlimitedTime'
                onChange={handleMessageRetention}
                label='Unlimited'
                aria-label='Unlimited'
                id='radio-controlled-3'
                value='unlimited'
              />
            </Stack>
          </FormGroup>
          <FormGroup
            fieldId='form-group-retention-size-in-wizard'
            label='Retention size'
          >
            <Stack hasGutter>
              <Radio
                isChecked={currentSize === RetentionSizeOption.UNLIMITED}
                name='radioUnlimitedSize'
                onChange={handleMessageRetention}
                label='Unlimited'
                aria-label='Unlimited'
                id='radio-controlled-6'
                value='unlimited'
              />
              <Radio
                isChecked={currentSize === RetentionSizeOption.CUSTOM}
                name='radioCustomSize'
                onChange={handleMessageRetention}
                label='Custom size'
                aria-label='custom input'
                id='radio-controlled-5'
                value='custom'
              />
              {currentSize === RetentionSizeOption.CUSTOM && (
                <div className='kafka-ui--radio__parameters'>
                  <Flex>
                    <FlexItem>
                      <NumberInput
                        onMinus={handleRetentionSizeMinusClick}
                        onPlus={handleRetentionSizePlusClick}
                        value={Number(topicData['retention.bytes'])}
                        onChange={handleRetentionSizeTouchSpinChange}
                        min={0}
                      />
                    </FlexItem>
                    <FlexItem>
                      <Select
                        variant={SelectVariant.single}
                        aria-label='Select Input'
                        onToggle={onRetentionSizeToggle}
                        onSelect={onRetentionSizeSelect}
                        selections={topicData['retention.bytes.unit']}
                        isOpen={isRetentionSizeSelectOpen}
                      >
                        <SelectOption key={5} value='bytes' isPlaceholder />
                        <SelectOption key={6} value='kibibytes' />
                        <SelectOption key={7} value='mebibytes' />
                        <SelectOption key={8} value='gibibytes' />
                        <SelectOption key={9} value='tebibytes' />
                      </Select>
                    </FlexItem>
                  </Flex>
                </div>
              )}
            </Stack>
          </FormGroup>
        </FormSection>
      </Form>
    </>
  );
};
