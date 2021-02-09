/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import {
  Flex,
  FlexItem,
  NumberInput,
  NumberInputProps,
} from '@patternfly/react-core';
import React from 'react';
import {
  DropdownWithToggle,
  IDropdownOption,
} from '../DropdownWithToggle.patternfly';

export interface SizeTimeFormGroup extends NumberInputProps {
  /** id of dropdown element */
  id: string;
  /** id of dropdown toggle button */
  toggleId: string;
  /** id of dropdown element */
  dropdownValue: string;
  /** name attribute of dropdown element */
  name: string;
  /** handler method of dropdown */
  onSelectOption?: (value: string, event) => void;
  /** aria label for dropdown element */
  ariaLabel?: string;
  /** determines whether to display memory units or time units */
  type: string;
}

export const SizeTimeFormGroup: React.FC<SizeTimeFormGroup> = ({
  id,
  toggleId,
  dropdownValue,
  ariaLabel,
  onSelectOption,
  name,
  inputName,
  onChange,
  onPlus,
  onMinus,
  value,
  plusBtnProps,
  minusBtnProps,
  type,
}) => {
  const timeUnits: IDropdownOption[] = [
    { key: 'millisecond', value: 'millisecond', isDisabled: false },
    { key: 'second', value: 'second', isDisabled: false },
    { key: 'day', value: 'day', isDisabled: false },
    { key: 'month', value: 'month', isDisabled: false },
    { key: 'year', value: 'year', isDisabled: false },
  ];

  const memoryUnits: IDropdownOption[] = [
    { key: 'bytes', value: 'bytes', isDisabled: false },
    { key: 'kilobytes', value: 'kilobytes', isDisabled: false },
    { key: 'megabytes', value: 'megabytes', isDisabled: false },
    { key: 'gigabytes', value: 'gigabytes', isDisabled: false },
    { key: 'terabytes', value: 'terabytes', isDisabled: false },
  ];

  const getItemsForType = (type: string) => {
    switch (type) {
      case 'time':
        return timeUnits;
      case 'memory':
        return memoryUnits;
      default:
        return [];
    }
  };

  return (
    <Flex>
      <FlexItem grow={{ default: 'grow' }}>
        <NumberInput
          inputName={inputName}
          onChange={onChange}
          onPlus={onPlus}
          onMinus={onMinus}
          value={value}
          plusBtnProps={plusBtnProps}
          minusBtnProps={minusBtnProps}
        />
      </FlexItem>
      <FlexItem>
        <DropdownWithToggle
          id={id}
          toggleId={toggleId}
          ariaLabel={ariaLabel}
          onSelectOption={onSelectOption}
          items={getItemsForType(type)}
          name={name}
          value={dropdownValue}
        />
      </FlexItem>
    </Flex>
  );
};
