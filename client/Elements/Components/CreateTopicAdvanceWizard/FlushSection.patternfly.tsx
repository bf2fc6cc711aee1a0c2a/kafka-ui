/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import {
  TextContent,
  Text,
  Flex,
  FlexItem,
  Form,
  TextVariants,
  Touchspin,
} from '@patternfly/react-core';
import React from 'react';
import { IFlushingData } from './CreateTopicAdvanceWizard.patternfly';
import {
  DropdownWithToggle,
  IDropdownOption,
} from '../Common/DropdownWithToggle.patternfly';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';

const timeUnits: IDropdownOption[] = [
  { key: 'millisecond', value: 'millisecond', isDisabled: false },
  { key: 'second', value: 'second', isDisabled: false },
  { key: 'day', value: 'day', isDisabled: false },
  { key: 'month', value: 'month', isDisabled: false },
  { key: 'year', value: 'year', isDisabled: false },
];

interface IFlushSectionProps {
  flushingData: IFlushingData;
  setFlushingData: React.Dispatch<React.SetStateAction<IFlushingData>>;
}

const intervalMessagesLabelHead = 'Flush interval messages';
const intervalMessagesLabelBody =
  'Determines the number of messages between flushing data to the log. Replication is a better way to ensure data is not lost when failures occur. (flush.messages)';

const intervalTimeLabelHead = 'Flush interval time';
const intervalTimeLabelBody =
  'Determines the interval in time between flushing data to the log. Replication is a better way to ensure data is not lost when failures occur. (flush.ms)';

export const FlushSection: React.FC<IFlushSectionProps> = ({
  flushingData,
  setFlushingData,
}) => {
  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName, value } = event.currentTarget;
    setFlushingData((formData) => ({
      ...formData,
      [fieldName]: Number(value),
    }));
  };

  const handleTouchSpinPlus = (event) => {
    const { name: fieldName } = event.currentTarget;
    setFlushingData((formData) => ({
      ...formData,
      [fieldName]: formData[fieldName] + 1,
    }));
  };

  const handleTouchSpinMinus = (event) => {
    const { name: fieldName } = event.currentTarget;
    setFlushingData((formData) => ({
      ...formData,
      [fieldName]: formData[fieldName] - 1,
    }));
  };

  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    setFlushingData((formData) => ({
      ...formData,
      [fieldName]: value,
    }));
  };

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2} tabIndex={-1} id='flush'>
          Flush
        </Text>
        <Text component={TextVariants.p}>
          These details control the frequency of the flushing of the log.
        </Text>
      </TextContent>
      <Form>
        <FormGroupWithPopover
          fieldId='interval-messages'
          fieldLabel='Flush interval messages'
          labelHead={intervalMessagesLabelHead}
          labelBody={intervalMessagesLabelBody}
          buttonAriaLabel='More info for flush interval messages field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                inputName='interval-messages'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={flushingData['interval-messages']}
                plusBtnProps={{ name: 'interval-messages' }}
                minusBtnProps={{ name: 'interval-messages' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='interval-messages-unit-dropdown'
                toggleId='interval-messages-unit-dropdowntoggle'
                name='interval-messages-unit'
                ariaLabel='select unit from dropdown'
                onSelectOption={onDropdownChange}
                items={timeUnits}
                value={flushingData['interval-messages-unit']}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='flush'
          fieldLabel='Flush interval time'
          labelHead={intervalTimeLabelHead}
          labelBody={intervalTimeLabelBody}
          buttonAriaLabel='More info for flush interval time field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                inputName='interval-time'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={flushingData['interval-time']}
                plusBtnProps={{ name: 'interval-time' }}
                minusBtnProps={{ name: 'interval-time' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='interval-time-unit-dropdown'
                toggleId='interval-time-unit-dropdowntoggle'
                name='interval-time-unit'
                ariaLabel='select unit from dropdown'
                onSelectOption={onDropdownChange}
                items={timeUnits}
                value={flushingData['interval-time-unit']}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>
      </Form>
    </>
  );
};
