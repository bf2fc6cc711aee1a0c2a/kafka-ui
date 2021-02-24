/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
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
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import './CreateTopicWizard.patternfly.css';

export interface IStepMessageRetention {
  setMsgRetentionValue: (value: number) => void;
}

export const StepMessageRetention: React.FC<IStepMessageRetention> = ({
  setMsgRetentionValue,
}) => {
  enum RetentionOption {
    DAY = 1,
    WEEK = 7,
    MONTH = 30,
    CUSTOM = 'custom',
  }

  const [currentPeriod, setCurrentPeriod] = React.useState<string | number>(
    RetentionOption.DAY
  );
  const [msgTouchspinValue, setMsgTouchspinValue] = useState(7);
  const [isMsgSelectOpen, setIsMsgSelectOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [retentionFactor, setRetentionFactor] = useState(1);

  useEffect(() => {
    if (currentPeriod === RetentionOption.DAY) {
      setMsgRetentionValue(RetentionOption.DAY);
    } else if (currentPeriod === RetentionOption.WEEK) {
      setMsgRetentionValue(RetentionOption.WEEK);
    } else if (currentPeriod === RetentionOption.MONTH) {
      setMsgRetentionValue(RetentionOption.MONTH);
    } else if (currentPeriod === RetentionOption.CUSTOM) {
      setMsgRetentionValue(retentionFactor * msgTouchspinValue);
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
      setCurrentPeriod(RetentionOption.MONTH);
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
    } else if (selection === 'months') {
      setRetentionFactor(RetentionOption.MONTH);
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

  return (
    <>
      <TextContent className='topics-wizard-content'>
        <Text component={TextVariants.h2}>Message retention</Text>
        <Text component={TextVariants.p}>
          This is how long messages are retained before they are deleted.
        </Text>
        <Text component={TextVariants.small}>
          If your messages are not read by a consumer within this time, they
          will be missed.
        </Text>
      </TextContent>
      <Form className='form-in-wizard'>
        <FormGroup
          fieldId='form-group-in-wizard'
          label='Message retention'
          className='form-group-radio'
        >
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
            isChecked={currentPeriod === RetentionOption.MONTH}
            name='radio3'
            onChange={handleMessageRetention}
            label='A month'
            aria-label='A month'
            id='radio-controlled-3'
            value='month'
          />
          <Radio
            isChecked={currentPeriod === RetentionOption.CUSTOM}
            name='radio4'
            onChange={handleMessageRetention}
            label=''
            aria-label='custom input'
            id='radio-controlled-4'
            value='custom'
          />
          <div className='radio-description radio-step-3'>
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
                  <SelectOption key={0} value='days' isPlaceholder />
                  <SelectOption key={1} value='weeks' />
                  <SelectOption key={2} value='months' />
                </Select>
              </FlexItem>
            </Flex>
          </div>
        </FormGroup>
      </Form>
    </>
  );
};
