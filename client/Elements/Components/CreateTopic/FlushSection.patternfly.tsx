/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { TextContent, Text, Form, TextVariants } from '@patternfly/react-core';
import React from 'react';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';
import { kebabToCamel } from './utils';
import { SizeTimeFormGroup } from '../Common/SizeTimeFormGroup/SizeTimeFormGroup.patternfly';
import { TopicContext } from 'Contexts/Topic';
import { useTranslation } from 'react-i18next';

export const FlushSection: React.FC = () => {
  const { store, updateStore } = React.useContext(TopicContext);

  const { t } = useTranslation();

  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName, value } = event.currentTarget;
    updateStore(fieldName, value);
  };

  const handleTouchSpinPlus = (event) => {
    const { name } = event.currentTarget;
    const fieldName = kebabToCamel(name);
    updateStore(fieldName, store[fieldName] + 1);
  };

  const handleTouchSpinMinus = (event) => {
    const { name } = event.currentTarget;
    const fieldName = kebabToCamel(name);
    updateStore(fieldName, store[fieldName] - 1);
  };

  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    updateStore(kebabToCamel(fieldName), value);
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
          labelHead={'createTopic.intervalMessagesLabelHead'}
          labelBody={'createTopic.intervalMessagesLabelBody'}
          buttonAriaLabel='More info for flush interval messages field'
        >
          <SizeTimeFormGroup
            inputName='interval-messages'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.intervalMessages}
            plusBtnProps={{ name: 'interval-messages' }}
            minusBtnProps={{ name: 'interval-messages' }}
            id='interval-messages-unit-dropdown'
            toggleId='interval-messages-unit-dropdowntoggle'
            name='interval-messages-unit'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='time'
            dropdownValue={store.intervalMessagesUnit}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='flush'
          fieldLabel='Flush interval time'
          labelHead={t('createTopic.intervalTimeLabelHead')}
          labelBody={t('createTopic.intervalTimeLabelBody')}
          buttonAriaLabel='More info for flush interval time field'
        >
          <SizeTimeFormGroup
            inputName='interval-time'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.intervalTime}
            plusBtnProps={{ name: 'interval-time' }}
            minusBtnProps={{ name: 'interval-time' }}
            id='interval-time-unit-dropdown'
            toggleId='interval-time-unit-dropdowntoggle'
            name='interval-time-unit'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            dropdownValue={store.intervalTimeUnit}
            type='time'
          />
        </FormGroupWithPopover>
      </Form>
    </>
  );
};
