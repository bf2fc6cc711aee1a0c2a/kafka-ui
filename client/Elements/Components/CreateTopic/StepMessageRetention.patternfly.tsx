/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { useState } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Radio,
  Select,
  SelectOption,
  SelectVariant,
  TextContent,
  Text,
  TextVariants,
  Touchspin,
} from '@patternfly/react-core';
import './CreateTopicWizard.patternfly.css';

interface IStepMessageRetention {
  setMsgRetentionValue: (value: number) => void;
}

export const StepMessageRetention: React.FC<IStepMessageRetention> = ({
  setMsgRetentionValue,
}) => {
  const [radioBtnDay, setRadioBtnDay] = useState(false);
  const [radioBtnWeek, setRadioBtnWeek] = useState(false);
  const [radioBtnMonth, setRadioBtnMonth] = useState(false);
  const [radioBtnCustomTime, setRadioBtnCustomTime] = useState(false);
  const [msgTouchspinValue, setMsgTouchspinValue] = useState(7);
  const [isMsgSelectOpen, setIsMsgSelectOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  let retentionFactor = 1;
  const handleChangeStep3 = (checked, event) => {
    setRadioBtnDay(false);
    setRadioBtnWeek(false);
    setRadioBtnMonth(false);
    setRadioBtnCustomTime(false);

    const target = event.target;
    const name = target.name;

    if (name === 'radio1') {
      setRadioBtnDay(true);
      setMsgRetentionValue(1); //A day
    } else if (name === 'radio2') {
      setRadioBtnWeek(true);
      setMsgRetentionValue(7); //A week
    } else if (name === 'radio3') {
      setRadioBtnMonth(true);
      setMsgRetentionValue(30); //A month
    } else if (name === 'radio4') {
      setRadioBtnCustomTime(true);
      setMsgRetentionValue(retentionFactor * msgTouchspinValue);
    }
  };

  const onMsgToggle = (isMsgSelectOpen) => {
    setIsMsgSelectOpen(isMsgSelectOpen);
  };

  const onMsgSelect = (event, selection) => {
    if (selection === 'days') {
      retentionFactor = 1;
    } else if (selection === 'weeks') {
      retentionFactor = 7;
    } else if (selection === 'months') {
      retentionFactor = 30;
    }
    setMsgRetentionValue(retentionFactor * msgTouchspinValue);
    setSelected(selection);
    setIsMsgSelectOpen(false);
  };

  const handlePlusClick = () => {
    setMsgTouchspinValue(msgTouchspinValue + 1);
    setMsgRetentionValue(msgTouchspinValue + 1);
  };

  const handleMinusClick = () => {
    setMsgTouchspinValue(msgTouchspinValue - 1);
    setMsgRetentionValue(msgTouchspinValue - 1);
  };

  const handleMsgTouchSpinChange = (event) => {
    setMsgTouchspinValue(Number(event.target.value));
    setMsgRetentionValue(Number(event.target.value));
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
            isChecked={radioBtnDay}
            name='radio1'
            onChange={handleChangeStep3}
            label='A day'
            id='radio-controlled-1'
            value='day'
          />
          <Radio
            isChecked={radioBtnWeek}
            name='radio2'
            onChange={handleChangeStep3}
            label='A week'
            id='radio-controlled-2'
            value='week'
          />
          <Radio
            isChecked={radioBtnMonth}
            name='radio3'
            onChange={handleChangeStep3}
            label='A month'
            id='radio-controlled-3'
            value='month'
          />
          <Radio
            isChecked={radioBtnCustomTime}
            name='radio4'
            onChange={handleChangeStep3}
            label=''
            id='radio-controlled-4'
            value='custom'
          />
          <div className='radio-description radio-step-3'>
            <Flex>
              <FlexItem>
                <Touchspin
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
