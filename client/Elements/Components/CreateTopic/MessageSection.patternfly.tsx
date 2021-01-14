/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import '@patternfly/react-core/dist/styles/base.css';
import { TextVariants, Text, TextContent, Form } from '@patternfly/react-core';
import React from 'react';
import {
  DropdownWithToggle,
  IDropdownOption,
} from '../Common/DropdownWithToggle.patternfly';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';
import { kebabToCamel } from './utils';
import { TopicContext } from 'Contexts/Topic';
import { SizeTimeFormGroup } from '../Common/SizeTimeFormGroup/SizeTimeFormGroup.patternfly';
import { useTranslation } from 'react-i18next';

const timeStampOptions: IDropdownOption[] = [
  { key: 'create-time', value: 'CreateTime', isDisabled: false },
  { key: 'log-append-time', value: 'LogAppendTime', isDisabled: false },
];

const messageCompressionTypes: IDropdownOption[] = [
  { key: 'Producer', value: 'Producer', isDisabled: false },
  { key: 'Gzip', value: 'Gzip', isDisabled: false },
  { key: 'Snappy', value: 'Snappy', isDisabled: false },
  { key: 'LZ4', value: 'LZ4', isDisabled: false },
  { key: 'Zstandard', value: 'Zstandard', isDisabled: false },
  { key: 'Uncompressed', value: 'Uncompressed', isDisabled: false },
];

const MessageSection: React.FC = () => {
  const { store, updateStore } = React.useContext(TopicContext);

  const { t } = useTranslation();

  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName, value } = event.currentTarget;
    updateStore(kebabToCamel(fieldName), value);
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
        <Text component={TextVariants.h2} tabIndex={-1} id='messages'>
          Messages
        </Text>
        <Text component={TextVariants.p}>
          These details control how your messages will be handled in the Kafka
          instance.
        </Text>
      </TextContent>
      <Form>
        <FormGroupWithPopover
          fieldId='maxsize'
          fieldLabel='Maximum message size'
          labelHead={t('createTopic.maxMessageSizeLabelHead')}
          labelBody={t('createTopic.maxMessageSizeLabelBody')}
          buttonAriaLabel='More info for maximum message size field'
        >
          <SizeTimeFormGroup
            inputName='max-message-size'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.maxMessageSize}
            plusBtnProps={{ name: 'max-message-size' }}
            minusBtnProps={{ name: 'max-message-size' }}
            id='msg-section-units-dropdown'
            toggleId='msg-section-units-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='memory'
            name='message-size-unit'
            dropdownValue={store.messageSizeUnit}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='timestamp'
          fieldLabel='Message timestamp type'
          labelHead={t('createTopic.messageTimestampLabelHead')}
          labelBody={t('createTopic.messageTimestampLabelBody')}
          buttonAriaLabel='More info for message timestamp field'
        >
          <DropdownWithToggle
            id='msg-section-timestamp-dropdown'
            toggleId='msg-section-timestamp-dropdowntoggle'
            ariaLabel='select timestamp type from dropdown'
            name='timestamp-type'
            onSelectOption={onDropdownChange}
            items={timeStampOptions}
            value={store.timestampType}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='max-difference'
          fieldLabel='Message timestamp difference'
          labelHead={t('createTopic.messageTimestampDiffLabelHead')}
          labelBody={t('createTopic.messageTimestampDiffLabelBody')}
          buttonAriaLabel='More info for maximum message timestamp difference field'
        >
          <SizeTimeFormGroup
            inputName='max-timestamp-diff'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={store.maxTimestampDiff}
            plusBtnProps={{ name: 'max-timestamp-diff' }}
            minusBtnProps={{ name: 'max-timestamp-diff' }}
            id='msg-section-timestamp-diff-units-dropdown'
            toggleId='msg-section-timestamp-diff-units-dropdowntoggle'
            ariaLabel='select unit from dropdown'
            onSelectOption={onDropdownChange}
            type='time'
            name='timestamp-diff-unit'
            dropdownValue={store.timestampDiffUnit}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='compression-type'
          fieldLabel='Compression type'
          labelHead={t('createTopic.compressionTypeLabelHead')}
          labelBody={t('createTopic.compressionTypeLabelBody')}
          buttonAriaLabel='More info for comprssion type field'
        >
          <DropdownWithToggle
            id='compression-type'
            toggleId='msg-section-compression-type-dropdowntoggle'
            ariaLabel='select timestamp type from dropdown'
            name='compression-type'
            onSelectOption={onDropdownChange}
            items={messageCompressionTypes}
            value={store.compressionType}
          />
        </FormGroupWithPopover>
      </Form>
    </>
  );
};

export { MessageSection };
