/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons';

interface IDropdownWithToggleProps {
  id: string;
  toggleId: string;
  value: string;
  name: string;
  items: IDropdownOption[];
  onSelectOption?: (value: string, event) => void;
  ariaLabel?: string;
}

export interface IDropdownOption {
  value: string;
  label?: string;
  key?: string;
  isDisabled?: boolean;
}

export const DropdownWithToggle: React.FC<IDropdownWithToggleProps> = ({
  id,
  toggleId,
  items,
  value,
  ariaLabel,
  onSelectOption,
  name,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>();

  const onToggle = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const onSelect = (e) => {
    const value = e.currentTarget.textContent;
    if (onSelectOption) {
      e.target.name = name;
      onSelectOption(value, e);
    }
    setIsOpen((isOpen) => !isOpen);
  };

  const getItems = (options: IDropdownOption[]) => {
    const items = options.map((option) => {
      const { key, value, label } = option;

      return (
        <DropdownItem key={key} value={value}>
          {label || value}
        </DropdownItem>
      );
    });

    return items;
  };

  const dropdownToggle = (
    <DropdownToggle
      id={toggleId}
      onToggle={onToggle}
      toggleIndicator={CaretDownIcon}
    >
      {value}
    </DropdownToggle>
  );

  return (
    <Dropdown
      name={name}
      id={id}
      onSelect={onSelect}
      toggle={dropdownToggle}
      isOpen={isOpen}
      aria-label={ariaLabel}
      dropdownItems={getItems(items)}
    />
  );
};
