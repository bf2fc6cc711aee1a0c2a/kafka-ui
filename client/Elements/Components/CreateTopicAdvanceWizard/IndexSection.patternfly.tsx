/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import {
  TextContent,
  Text,
  Form,
  Flex,
  FlexItem,
  TextVariants,
  Touchspin,
} from '@patternfly/react-core';
import React from 'react';
import {
  DropdownWithToggle,
  IDropdownOption,
} from '../Common/DropdownWithToggle.patternfly';
import { IIndexData } from './CreateTopicAdvanceWizard.patternfly';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';

interface IIndexSectionProps {
  indexingData: IIndexData;
  setIndexingData: React.Dispatch<React.SetStateAction<IIndexData>>;
}

const memoryUnits: IDropdownOption[] = [
  { key: 'bytes', value: 'bytes', isDisabled: false },
  { key: 'kilobytes', value: 'kilobytes', isDisabled: false },
  { key: 'megabytes', value: 'megabytes', isDisabled: false },
  { key: 'gigabytes', value: 'gigabytes', isDisabled: false },
  { key: 'terabytes', value: 'terabytes', isDisabled: false },
];

const indexIntervalLabelHead = 'Index interval size';
const indexIntervalLabelBody =
  'Determines the granularity of the offset index. (index.interval.bytes)';
const segementIntervalLabelHead = 'Segment index size';
const segementIntervalLabelBody =
  'The size of the index that maps offsets to file positions. (segment.index.bytes)';

export const IndexSection: React.FC<IIndexSectionProps> = ({
  indexingData,
  setIndexingData,
}) => {
  const handleTouchSpinInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName, value } = event.currentTarget;
    setIndexingData((formData) => ({
      ...formData,
      [fieldName]: Number(value),
    }));
  };

  const handleTouchSpinPlus = (event) => {
    const { name: fieldName } = event.currentTarget;
    setIndexingData((formData) => ({
      ...formData,
      [fieldName]: formData[fieldName] + 1,
    }));
  };

  const handleTouchSpinMinus = (event) => {
    const { name: fieldName } = event.currentTarget;
    setIndexingData((formData) => ({
      ...formData,
      [fieldName]: formData[fieldName] - 1,
    }));
  };

  const onDropdownChange = (value: string, event) => {
    const { name: fieldName } = event.target;
    setIndexingData((formData) => ({
      ...formData,
      [fieldName]: value,
    }));
  };

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2} tabIndex={-1} id='index'>
          Index
        </Text>
        <Text component={TextVariants.p}>
          These details control the indexing of the log.
        </Text>
      </TextContent>

      <Form>
        <FormGroupWithPopover
          fieldId='interval-bytes'
          fieldLabel='Index interval bytes'
          labelHead={indexIntervalLabelHead}
          labelBody={indexIntervalLabelBody}
          buttonAriaLabel='More info for index interval bytes field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                id='index-interval-size'
                inputName='index-interval-size'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={indexingData['index-interval-size']}
                plusBtnProps={{ name: 'index-interval-size' }}
                minusBtnProps={{ name: 'index-interval-size' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='index-interval-unit-dropdown'
                toggleId='index-interval-unit-dropdowntoggle'
                name='index-interval-unit'
                ariaLabel='select unit from dropdown'
                onSelectOption={onDropdownChange}
                items={memoryUnits}
                value={indexingData['index-interval-unit']}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='int-bytes'
          fieldLabel='Segment interval bytes'
          labelHead={segementIntervalLabelHead}
          labelBody={segementIntervalLabelBody}
          buttonAriaLabel='More info for segment interval bytes field'
        >
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <Touchspin
                id='segment-index-size'
                inputName='segment-index-size'
                onChange={handleTouchSpinInputChange}
                onPlus={handleTouchSpinPlus}
                onMinus={handleTouchSpinMinus}
                value={indexingData['segment-index-size']}
                plusBtnProps={{ name: 'segment-index-size' }}
                minusBtnProps={{ name: 'segment-index-size' }}
              />
            </FlexItem>
            <FlexItem>
              <DropdownWithToggle
                id='segment-index-unit-dropdown'
                toggleId='segment-index-unit-dropdowntoggle'
                name='segment-index-unit'
                ariaLabel='select duration from dropdown'
                onSelectOption={onDropdownChange}
                items={memoryUnits}
                value={indexingData['segment-index-unit']}
              />
            </FlexItem>
          </Flex>
        </FormGroupWithPopover>
      </Form>
    </>
  );
};
