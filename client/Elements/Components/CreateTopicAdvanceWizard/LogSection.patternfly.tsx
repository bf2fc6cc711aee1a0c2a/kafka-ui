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
import { ILogFormData } from './CreateTopicAdvanceWizard.patternfly';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';

const memoryUnits: IDropdownOption[] = [
  { key: 'bytes', value: 'bytes', isDisabled: false },
  { key: 'kilobytes', value: 'kilobytes', isDisabled: false },
  { key: 'megabytes', value: 'megabytes', isDisabled: false },
  { key: 'gigabytes', value: 'gigabytes', isDisabled: false },
  { key: 'terabytes', value: 'terabytes', isDisabled: false },
];

const clearOptions: IDropdownOption[] = [
  { key: 'compact', value: 'compact', isDisabled: false },
  { key: 'delete', value: 'delete', isDisabled: false },
  { key: 'compact-delete', value: 'compact, delete', isDisabled: false },
  { key: 'delete-compact', value: 'delete, compact', isDisabled: false },
];

export interface ILogSectionProps {
  logFormData: ILogFormData;
  setLogFormData: React.Dispatch<React.SetStateAction<ILogFormData>>;
}

const cleanupPolicyLabelHead = 'Cleanup policy';
const cleanupPolicyLabelBody =
  'Determines what happens to log segments beyond the retention window. (cleanup.policy)';

const retentionBytesLabelHead = 'Retention size';
const retentionBytesLabelBody =
  "The maximum total size of a partition's log segments before old log segments are deleted to free up space. (retention.bytes)";

const logSegmentLabelHead = 'Log segment size';
const logSegmentLabelBody =
  'The size of the log segment files. Log processing such as deletion and compaction operates on log segments, so a larger setting gives fewer files but less frequent log processing. (segment.bytes)';

const LogSection: React.FC<ILogSectionProps> = ({
  logFormData,
  setLogFormData,
}) => {
  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    setLogFormData((formData) => ({
      ...formData,
      [fieldName]: value,
    }));
  };

  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName, value } = event.currentTarget;
    setLogFormData((formData) => ({
      ...formData,
      [fieldName]: Number(value),
    }));
  };

  const handleTouchSpinPlus = (event) => {
    const { name: fieldName } = event.currentTarget;
    setLogFormData((formData) => ({
      ...formData,
      [fieldName]: formData[fieldName] + 1,
    }));
  };

  const handleTouchSpinMinus = (event) => {
    const { name: fieldName } = event.currentTarget;
    setLogFormData((formData) => ({
      ...formData,
      [fieldName]: formData[fieldName] - 1,
    }));
  };

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2} tabIndex={-1} id='log'>
          Log
        </Text>
        <Text component={TextVariants.p}>
          Messages are continually appended to the partition’s log. This is when
          they are assigned their offset. These details define how your log is
          handled.
        </Text>
      </TextContent>

      <Form>
        <FormGroupWithPopover
          fieldId='cleanup-policy'
          fieldLabel='Cleanup policy'
          labelHead={cleanupPolicyLabelHead}
          labelBody={cleanupPolicyLabelBody}
          buttonAriaLabel='More info for cleanup policy field'
        >
          <DropdownWithToggle
            id='log-section-policy-type-dropdown'
            toggleId='log-section-policy-type-dropdowntoggle'
            ariaLabel='select policy type from dropdown'
            onSelectOption={onDropdownChange}
            items={clearOptions}
            name='cleanup-policy'
            value={logFormData['cleanup-policy']}
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='retention-bytes'
          fieldLabel='Retention bytes'
          labelHead={retentionBytesLabelHead}
          labelBody={retentionBytesLabelBody}
          buttonAriaLabel='More info for retention bytes field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                inputName='retention-bytes'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={logFormData['retention-bytes']}
                plusBtnProps={{ name: 'retention-bytes' }}
                minusBtnProps={{ name: 'retention-bytes' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='log-section-retention-unit-dropdown'
                toggleId='log-section-retention-unit-dropdowntoggle'
                ariaLabel='select unit from dropdown'
                onSelectOption={onDropdownChange}
                items={memoryUnits}
                name='retention-unit'
                value={logFormData['retention-unit']}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>

        <FormGroupWithPopover
          fieldId='log-type'
          fieldLabel='Log segment types'
          labelHead={logSegmentLabelHead}
          labelBody={logSegmentLabelBody}
          buttonAriaLabel='More info for log segment types field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                inputName='segment-type'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={logFormData['segment-type']}
                plusBtnProps={{ name: 'segment-type' }}
                minusBtnProps={{ name: 'segment-type' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='log-section-segment-unit-dropdown'
                toggleId='log-section-segment-unit-dropdowntoggle'
                ariaLabel='select unit from dropdown'
                onSelectOption={onDropdownChange}
                items={memoryUnits}
                name='segment-unit'
                value={logFormData['segment-unit']}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>
      </Form>
    </>
  );
};

export { LogSection };
