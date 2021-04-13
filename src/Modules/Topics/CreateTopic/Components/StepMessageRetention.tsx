import React, { useEffect, useState } from 'react';
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
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
import './CreateTopicWizard.css';

export interface IStepMessageRetention {
  setMsgRetentionValue: (value: number) => void;
  currentPeriod: string | number;
  currentSize: string | number;
  setCurrentPeriod: (value: string | number) => void;
  setCurrentSize: (value: string | number) => void;
  setRetentionSize: (value: number) => void;
}

export const StepMessageRetention: React.FC<IStepMessageRetention> = ({
  setMsgRetentionValue,
  currentPeriod,
  currentSize,
  setCurrentPeriod,
  setCurrentSize,
  setRetentionSize,
}) => {
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
    KILOBYTE = 1000,
    MEGABYTE = 1000000,
    GIGABYTE = 1000000000,
    TERABYTE = 1000000000000,
    CUSTOM = 'custom',
    UNLIMITED = -1,
  }
  const [
    retentionTimeTouchspinValue,
    setRetentionTimeTouchspinValue,
  ] = useState<number>(7);
  const [
    retentionSizeTouchspinValue,
    setRetentionSizeTouchspinValue,
  ] = useState<number>(1);
  const [
    isRetentionTimeSelectOpen,
    setIsRetentionTimeSelectOpen,
  ] = useState<boolean>(false);
  const [
    isRetentionSizeSelectOpen,
    setIsRetentionSizeSelectOpen,
  ] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<boolean>(false);
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
    } else if (selection === 'kilobytes') {
      setRetentionSizeFactor(RetentionSizeOption.KILOBYTE);
    } else if (selection === 'megabytes') {
      setRetentionSizeFactor(RetentionSizeOption.MEGABYTE);
    } else if (selection === 'gigabytes') {
      setRetentionSizeFactor(RetentionSizeOption.GIGABYTE);
    } else if (selection === 'terabytes') {
      setRetentionSizeFactor(RetentionSizeOption.TERABYTE);
    }
    setSelectedSize(selection);
    setIsRetentionSizeSelectOpen(false);
  };

  const handleRetentionTimePlusClick = () => {
    setRetentionTimeTouchspinValue(retentionTimeTouchspinValue + 1);
  };

  const handleRetentionTimeMinusClick = () => {
    setRetentionTimeTouchspinValue(retentionTimeTouchspinValue - 1);
  };

  const handleRetentionTimeTouchSpinChange = (event) => {
    setRetentionTimeTouchspinValue(Number(event.target.value));
  };

  const handleRetentionSizePlusClick = () => {
    setRetentionSizeTouchspinValue(retentionSizeTouchspinValue + 1);
  };

  const handleRetentionSizeMinusClick = () => {
    setRetentionSizeTouchspinValue(retentionSizeTouchspinValue - 1);
  };

  const handleRetentionSizeTouchSpinChange = (event) => {
    setRetentionSizeTouchspinValue(Number(event.target.value));
  };

  const preventFormSubmit = (event) => event.preventDefault();

  return (
    <>
      <Stack hasGutter className='kafka-ui--wizard-main-body__stack'>
        <TextContent>
          <Text component={TextVariants.h2}>Message retention</Text>
          <Text component={TextVariants.p}>
            How long messages are retained and the maximum total size of all log
            segments in a partition before they are deleted to free up space
          </Text>
          <Text component={TextVariants.small}>
            Messages that aren't read by a consumer within this time will be
            missed. By default, a limit is only applied to retention time.
          </Text>
        </TextContent>

        <Form onSubmit={preventFormSubmit}>
          <FormGroup
            fieldId='form-group-retention-time-in-wizard'
            label='Retention time'
            // className='form-group-radio'
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
              <div className='kafka-ui--radio__parameters'>
                <Flex>
                  <FlexItem>
                    <NumberInput
                      onMinus={handleRetentionTimeMinusClick}
                      onPlus={handleRetentionTimePlusClick}
                      value={retentionTimeTouchspinValue}
                      onChange={handleRetentionTimeTouchSpinChange}
                    />
                  </FlexItem>
                  <FlexItem>
                    <Select
                      variant={SelectVariant.single}
                      aria-label='Select Input'
                      onToggle={onRetentionTimeToggle}
                      onSelect={onRetentionTimeSelect}
                      selections={selectedTime}
                      isOpen={isRetentionTimeSelectOpen}
                      // aria-labelledby={titleId}
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
                isChecked={currentSize === RetentionSizeOption.CUSTOM}
                name='radioCustomSize'
                onChange={handleMessageRetention}
                label='Custom size'
                aria-label='custom input'
                id='radio-controlled-5'
                value='custom'
              />
              <div className='kafka-ui--radio__parameters'>
                <Flex>
                  <FlexItem>
                    <NumberInput
                      onMinus={handleRetentionSizeMinusClick}
                      onPlus={handleRetentionSizePlusClick}
                      value={retentionSizeTouchspinValue}
                      onChange={handleRetentionSizeTouchSpinChange}
                    />
                  </FlexItem>
                  <FlexItem>
                    <Select
                      variant={SelectVariant.single}
                      aria-label='Select Input'
                      onToggle={onRetentionSizeToggle}
                      onSelect={onRetentionSizeSelect}
                      selections={selectedSize}
                      isOpen={isRetentionSizeSelectOpen}
                      // aria-labelledby={titleId}
                    >
                      <SelectOption key={5} value='bytes' isPlaceholder />
                      <SelectOption key={6} value='kilobytes' />
                      <SelectOption key={7} value='megabytes' />
                      <SelectOption key={8} value='gigabytes' />
                      <SelectOption key={9} value='terabytes' />
                    </Select>
                  </FlexItem>
                </Flex>
              </div>
              <Radio
                isChecked={currentSize === RetentionSizeOption.UNLIMITED}
                name='radioUnlimitedSize'
                onChange={handleMessageRetention}
                label='Unlimited'
                aria-label='Unlimited'
                id='radio-controlled-6'
                value='unlimited'
              />
            </Stack>
          </FormGroup>
        </Form>
      </Stack>
    </>
  );
};
