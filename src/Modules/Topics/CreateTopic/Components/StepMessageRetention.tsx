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
  setCurrentPeriod: (value: string | number) => void;
  setRetentionSize: (value: number) => void;
}

export const StepMessageRetention: React.FC<IStepMessageRetention> = ({
  setMsgRetentionValue,
  currentPeriod,
  setCurrentPeriod,
  setRetentionSize,
}) => {
  enum RetentionOption {
    DAY = 1,
    WEEK = 7,
    CUSTOM = 'custom',
    UNLIMITED = -1,
  }
  const [msgTouchspinValue, setMsgTouchspinValue] = useState(7);
  const [isMsgSelectOpen, setIsMsgSelectOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [retentionFactor, setRetentionFactor] = useState(1);

  useEffect(() => {
    if (currentPeriod === RetentionOption.DAY) {
      setMsgRetentionValue(RetentionOption.DAY * 86400000);
      setRetentionSize(RetentionOption.UNLIMITED);
    } else if (currentPeriod === RetentionOption.WEEK) {
      setMsgRetentionValue(RetentionOption.WEEK * 86400000);
    } else if (currentPeriod === RetentionOption.UNLIMITED) {
      setMsgRetentionValue(RetentionOption.UNLIMITED);
    } else if (currentPeriod === RetentionOption.CUSTOM) {
      setMsgRetentionValue(retentionFactor * msgTouchspinValue * 86400000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPeriod, msgTouchspinValue, retentionFactor]);

  const handleMessageRetention = (checked, event) => {
    const target = event.target;
    const name = target.name;

    if (name === 'radio1') {
      setCurrentPeriod(RetentionOption.DAY);
    } else if (name === 'radio2') {
      setCurrentPeriod(RetentionOption.WEEK);
    } else if (name === 'radio3') {
      setCurrentPeriod(RetentionOption.UNLIMITED);
    } else if (name === 'radio4') {
      setCurrentPeriod(RetentionOption.CUSTOM);
    }
  };

  const onMsgToggle = (isMsgSelectOpen) => {
    setIsMsgSelectOpen(isMsgSelectOpen);
  };

  const onMsgSelect = (event, selection) => {
    if (selection === 'days') {
      setRetentionFactor(RetentionOption.DAY);
    } else if (selection === 'weeks') {
      setRetentionFactor(RetentionOption.WEEK);
    } else if (selection === 'unlimited') {
      setRetentionFactor(RetentionOption.UNLIMITED);
    }
    setSelected(selection);
    setIsMsgSelectOpen(false);
  };

  const handlePlusClick = () => {
    setMsgTouchspinValue(msgTouchspinValue + 1);
  };

  const handleMinusClick = () => {
    setMsgTouchspinValue(msgTouchspinValue - 1);
  };

  const handleMsgTouchSpinChange = (event) => {
    setMsgTouchspinValue(Number(event.target.value));
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
                isChecked={currentPeriod === RetentionOption.DAY}
                name='radio1'
                onChange={handleMessageRetention}
                label='A day'
                aria-label='A day'
                id='radio-controlled-1'
                value='day'
              />
              <Radio
                isChecked={currentPeriod === RetentionOption.WEEK}
                name='radio2'
                onChange={handleMessageRetention}
                label='A week'
                aria-label='A week'
                id='radio-controlled-2'
                value='week'
              />
              <Radio
                isChecked={currentPeriod === RetentionOption.CUSTOM}
                name='radio4'
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
                      onMinus={handleMinusClick}
                      onPlus={handlePlusClick}
                      value={msgTouchspinValue}
                      onChange={handleMsgTouchSpinChange}
                    />
                  </FlexItem>
                  <FlexItem>
                    <Select
                      variant={SelectVariant.single}
                      aria-label='Select Input'
                      onToggle={onMsgToggle}
                      onSelect={onMsgSelect}
                      selections={selected}
                      isOpen={isMsgSelectOpen}
                      // aria-labelledby={titleId}
                    >
                      <SelectOption
                        key={0}
                        value='milliseconds'
                        isPlaceholder
                      />
                      <SelectOption key={0} value='milliseconds' />
                      <SelectOption key={1} value='seconds' />
                      <SelectOption key={2} value='minutes' />
                      <SelectOption key={3} value='hours' />
                      <SelectOption key={4} value='days' />
                    </Select>
                  </FlexItem>
                </Flex>
              </div>
              <Radio
                isChecked={currentPeriod === RetentionOption.UNLIMITED}
                name='radio3'
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
                isChecked={currentPeriod === RetentionOption.CUSTOM}
                name='radio5'
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
                      onMinus={handleMinusClick}
                      onPlus={handlePlusClick}
                      value={msgTouchspinValue}
                      onChange={handleMsgTouchSpinChange}
                    />
                  </FlexItem>
                  <FlexItem>
                    <Select
                      variant={SelectVariant.single}
                      aria-label='Select Input'
                      onToggle={onMsgToggle}
                      onSelect={onMsgSelect}
                      selections={selected}
                      isOpen={isMsgSelectOpen}
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
                isChecked={currentPeriod === RetentionOption.UNLIMITED}
                name='radio6'
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
