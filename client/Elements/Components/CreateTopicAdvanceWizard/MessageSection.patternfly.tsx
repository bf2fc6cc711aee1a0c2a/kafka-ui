/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import '@patternfly/react-core/dist/styles/base.css';
import {
  TextVariants,
  Text,
  TextContent,
  Form,
  Flex,
  FlexItem,
  Touchspin,
} from '@patternfly/react-core';
import React from 'react';
import {
  DropdownWithToggle,
  IDropdownOption,
} from '../Common/DropdownWithToggle.patternfly';
import { IMessagesData } from './CreateTopicAdvanceWizard.patternfly';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';

const maxMessageSizeLabelHead = 'Maximum message size';
const maxMessageSizeLabelBody =
  'The maximum record batch size. (max.message.bytes)';

const messageTimestampLabelHead = 'Message timestamp type';
const messageTimestampLabelBody =
  'Determines if the timestamp is made when the message is created or when the message is appended to the log. (message.timestamp.type)';

const messageTimestampDiffLabelHead = 'Maximum message timestamp difference';
const messageTimestampDiffLabelBody =
  'The maximum difference allowed between the timestamp of the message leaving the producer and arriving at the broker. (message.timestamp.difference.max.ms)';

const compressionTypeLabelHead = 'Compression type';
const compressionTypeLabelBody =
  'Determines the final compression for the topic, or whether to retain the compression set by the producer. (compression.type)';

export interface IMessageSectionProps {
  messagesFormData: IMessagesData;
  setMessagesFormData: React.Dispatch<React.SetStateAction<IMessagesData>>;
}

const memoryUnits: IDropdownOption[] = [
  { key: 'bytes', value: 'bytes', isDisabled: false },
  { key: 'kilobytes', value: 'kilobytes', isDisabled: false },
  { key: 'megabytes', value: 'megabytes', isDisabled: false },
  { key: 'gigabytes', value: 'gigabytes', isDisabled: false },
  { key: 'terabytes', value: 'terabytes', isDisabled: false },
];

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

const timeUnits: IDropdownOption[] = [
  { key: 'millisecond', value: 'millisecond', isDisabled: false },
  { key: 'second', value: 'second', isDisabled: false },
  { key: 'day', value: 'day', isDisabled: false },
  { key: 'month', value: 'month', isDisabled: false },
  { key: 'year', value: 'year', isDisabled: false },
];

const MessageSection: React.FC<IMessageSectionProps> = ({
  messagesFormData,
  setMessagesFormData,
}) => {
  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName, value } = event.currentTarget;
    setMessagesFormData((formData) => ({
      ...formData,
      [fieldName]: Number(value),
    }));
  };

  const handleTouchSpinPlus = (event) => {
    const { name: fieldName } = event.currentTarget;
    setMessagesFormData((formData) => ({
      ...formData,
      [fieldName]: formData[fieldName] + 1,
    }));
  };

  const handleTouchSpinMinus = (event) => {
    const { name: fieldName } = event.currentTarget;
    setMessagesFormData((formData) => ({
      ...formData,
      [fieldName]: formData[fieldName] - 1,
    }));
  };

  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    setMessagesFormData((formData) => ({
      ...formData,
      [fieldName]: value,
    }));
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
          labelHead={maxMessageSizeLabelHead}
          labelBody={maxMessageSizeLabelBody}
          buttonAriaLabel='More info for maximum message size field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                inputName='max-message-size'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={messagesFormData['max-message-size']}
                plusBtnProps={{ name: 'max-message-size' }}
                minusBtnProps={{ name: 'max-message-size' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='msg-section-units-dropdown'
                toggleId='msg-section-units-dropdowntoggle'
                ariaLabel='select unit from dropdown'
                onSelectOption={onDropdownChange}
                items={memoryUnits}
                name='unit'
                value={messagesFormData['unit']}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='timestamp'
          fieldLabel='Message timestamp type'
          labelHead={messageTimestampLabelHead}
          labelBody={messageTimestampLabelBody}
          buttonAriaLabel='More info for message timestamp field'
        >
          <DropdownWithToggle
            id='msg-section-timestamp-dropdown'
            toggleId='msg-section-timestamp-dropdowntoggle'
            ariaLabel='select timestamp type from dropdown'
            name='timestamp'
            onSelectOption={onDropdownChange}
            items={timeStampOptions}
            value={messagesFormData['timestamp']}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='max-difference'
          fieldLabel='Message timestamp difference'
          labelHead={messageTimestampDiffLabelHead}
          labelBody={messageTimestampDiffLabelBody}
          buttonAriaLabel='More info for maximum message timestamp difference field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                inputName='max-timestamp-diff'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={messagesFormData['max-timestamp-diff']}
                plusBtnProps={{ name: 'max-timestamp-diff' }}
                minusBtnProps={{ name: 'max-timestamp-diff' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='msg-section-timestamp-diff-units-dropdown'
                toggleId='msg-section-timestamp-diff-units-dropdowntoggle'
                ariaLabel='select unit from dropdown'
                onSelectOption={onDropdownChange}
                items={timeUnits}
                name='timestamp-diff-unit'
                value={messagesFormData['timestamp-diff-unit']}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='compression-type'
          fieldLabel='Compression type'
          labelHead={compressionTypeLabelHead}
          labelBody={compressionTypeLabelBody}
          buttonAriaLabel='More info for comprssion type field'
        >
          <DropdownWithToggle
            id='compression-type'
            toggleId='msg-section-compression-type-dropdowntoggle'
            ariaLabel='select timestamp type from dropdown'
            name='compression-type'
            onSelectOption={onDropdownChange}
            items={messageCompressionTypes}
            value={messagesFormData['compression-type']}
          />
        </FormGroupWithPopover>
      </Form>
    </>
  );
};

export { MessageSection };
