/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Checkbox,
  Flex,
  FlexItem,
  Form,
  TextContent,
  TextVariants,
  Touchspin,
  Text,
} from '@patternfly/react-core';
import {
  DropdownWithToggle,
  IDropdownOption,
} from '../Common/DropdownWithToggle.patternfly';
import { ICleanupData } from './CreateTopicAdvanceWizard.patternfly';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';

export interface ICleanupSectionProps {
  cleanupData: ICleanupData;
  setCleanupData: React.Dispatch<React.SetStateAction<ICleanupData>>;
}

const deleteRetentionLabelHead = 'Delete retention';
const deleteRetentionLabelBody =
  'Determines the time for which tombstone markers are retained if the topic is compacted. (delete.retention.ms)';

const minRatioLabelHead = 'Minimum cleanable dirty ratio';
const minRatioLabelBody =
  'Determines the frequency of compacting the log in terms of the proportion of duplicated keys allowed. Applies only to compacted topics. (min.cleanable.dirty.ratio)';

const minLagLabelHead = 'Minimum compaction lag time';
const minLagLabelBody =
  'The minimum time a message will remain uncompacted. Applies only to compacted topics. (min.compaction.lag.ms)';

const segementTimeLabelHead = 'Segment time';
const segementTimeLabelBody =
  'The period of time after which the current log segment is rolled even if it is not full. This permits log processing such as deletion and compaction to proceed for quiet topics. (segment.ms)';

const jitterTimeLabelHead = 'Segment jitter time';
const jitterTimeLabelBody =
  'Controls a random delay to add to log segment rolling with the aim of preventing bursts of log segment rolling activity. (segment.jitter.ms)';

const deleteDelayLabelHead = 'File delete delay';
const deleteDelayLabelBody =
  'The delay before deleting a file from the filesystem. (file.delete.delay.ms)';

const preallocateLabelHead = 'Preallocate log segment files';
const preallocateLabelBody =
  'Determines whether to preallocate log segment files. (preallocate)';

const timeUnits: IDropdownOption[] = [
  { key: 'millisecond', value: 'millisecond', isDisabled: false },
  { key: 'second', value: 'second', isDisabled: false },
  { key: 'day', value: 'day', isDisabled: false },
  { key: 'month', value: 'month', isDisabled: false },
  { key: 'year', value: 'year', isDisabled: false },
];

export const CleanupSection: React.FC<ICleanupSectionProps> = ({
  cleanupData,
  setCleanupData,
}) => {
  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName, value } = event.currentTarget;
    setCleanupData((formData) => ({
      ...formData,
      [fieldName]: Number(value),
    }));
  };

  const handleTouchSpinPlus = (event) => {
    const { name: fieldName } = event.currentTarget;
    setCleanupData((formData) => ({
      ...formData,
      [fieldName]: formData[fieldName] + 1,
    }));
  };

  const handleTouchSpinMinus = (event) => {
    const { name: fieldName } = event.currentTarget;
    setCleanupData((formData) => ({
      ...formData,
      [fieldName]: formData[fieldName] - 1,
    }));
  };

  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    setCleanupData((formData) => ({
      ...formData,
      [fieldName]: value,
    }));
  };

  const handleCheckboxSelect = (checked: boolean, event) => {
    const { name: fieldName } = event.currentTarget;
    setCleanupData((formData) => ({
      ...formData,
      [fieldName]: checked,
    }));
  };

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2} tabIndex={-1} id='cleanup'>
          Cleanup
        </Text>
        <Text component={TextVariants.p}>
          These details control the cleanup processing of the log.
        </Text>
      </TextContent>

      <Form>
        <FormGroupWithPopover
          fieldId='delete-retention'
          fieldLabel='Delete retention'
          labelHead={deleteRetentionLabelHead}
          labelBody={deleteRetentionLabelBody}
          buttonAriaLabel='More info for delete retention field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                inputName='delete-retention'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={cleanupData['delete-retention']}
                plusBtnProps={{ name: 'delete-retention' }}
                minusBtnProps={{ name: 'delete-retention' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='delete-retention-unit'
                toggleId='delete-retention-dropdowntoggle'
                ariaLabel='select unit from dropdown'
                onSelectOption={onDropdownChange}
                items={timeUnits}
                name='delete-retention-unit'
                value={cleanupData['delete-retention-unit']}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='dirty-ratio'
          fieldLabel='Minimum cleanable dirty ratio'
          labelHead={minRatioLabelHead}
          labelBody={minRatioLabelBody}
          buttonAriaLabel='More info for minimum cleanable ratio field'
        >
          <Touchspin
            inputName='min-ratio'
            onChange={handleTouchSpinInputChange}
            onPlus={handleTouchSpinPlus}
            onMinus={handleTouchSpinMinus}
            value={cleanupData['min-ratio']}
            plusBtnProps={{ name: 'min-ratio' }}
            minusBtnProps={{ name: 'min-ratio' }}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='compaction'
          fieldLabel='Minimum compaction lag time'
          labelHead={minLagLabelHead}
          labelBody={minLagLabelBody}
          buttonAriaLabel='More info for minimum compaction log time field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                inputName='min-lag-time'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={cleanupData['min-lag-time']}
                plusBtnProps={{ name: 'min-lag-time' }}
                minusBtnProps={{ name: 'min-lag-time' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='min-lag-unit'
                toggleId='min-lag-unit-dropdowntoggle'
                ariaLabel='select unit from dropdown'
                onSelectOption={onDropdownChange}
                items={timeUnits}
                name='min-lag-unit'
                value={cleanupData['min-lag-unit']}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='segment-time'
          fieldLabel='Segment time'
          labelHead={segementTimeLabelHead}
          labelBody={segementTimeLabelBody}
          buttonAriaLabel='More info for segment time field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                inputName='segment-time'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={cleanupData['segment-time']}
                plusBtnProps={{ name: 'segment-time' }}
                minusBtnProps={{ name: 'segment-time' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='segment-time-unit'
                toggleId='segment-time-unit-dropdowntoggle'
                ariaLabel='select unit from dropdown'
                onSelectOption={onDropdownChange}
                items={timeUnits}
                name='segment-time-unit'
                value={cleanupData['segment-time-unit']}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='jitter'
          fieldLabel='Segment jitter time'
          labelHead={jitterTimeLabelHead}
          labelBody={jitterTimeLabelBody}
          buttonAriaLabel='More info for segment jitter time field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                inputName='jitter-time'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={cleanupData['jitter-time']}
                plusBtnProps={{ name: 'jitter-time' }}
                minusBtnProps={{ name: 'jitter-time' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='jitter-time-unit'
                toggleId='jitter-time-unit-dropdowntoggle'
                ariaLabel='select unit from dropdown'
                onSelectOption={onDropdownChange}
                items={timeUnits}
                name='jitter-time-unit'
                value={cleanupData['jitter-time-unit']}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='delete'
          fieldLabel='File delete delay'
          labelHead={deleteDelayLabelHead}
          labelBody={deleteDelayLabelBody}
          buttonAriaLabel='More info for file delete delay field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                inputName='delete-delay'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={cleanupData['delete-delay']}
                plusBtnProps={{ name: 'delete-delay' }}
                minusBtnProps={{ name: 'delete-delay' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='delete-delay-unit'
                toggleId='delete-delay-unit-dropdowntoggle'
                ariaLabel='select unit from dropdown'
                onSelectOption={onDropdownChange}
                items={timeUnits}
                name='delete-delay-unit'
                value={cleanupData['delete-delay-unit']}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='log-preallocation'
          fieldLabel='Preallocate log segment files'
          labelHead={preallocateLabelHead}
          labelBody={preallocateLabelBody}
          buttonAriaLabel='More info for preallocation field'
        >
          <Checkbox
            isChecked={cleanupData['log-preallocation']}
            label='Allow preallocation of log segment files'
            aria-label='log segment files pre allocation'
            id='log-preallocation'
            onChange={handleCheckboxSelect}
            name='log-preallocation'
          />
        </FormGroupWithPopover>
      </Form>
    </>
  );
};
