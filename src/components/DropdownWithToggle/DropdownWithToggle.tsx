import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import CaretDownIcon from '@patternfly/react-icons/dist/js/icons/caret-down-icon';
import { DropdownProps } from '@patternfly/react-core/dist/js';

export interface IDropdownWithToggleProps {
  id: string;
  toggleId: string;
  value: string;
  name: string;
  items: IDropdownOption[];
  onSelectOption?: (value: string, name: string) => void;
  ariaLabel?: string;
  menuAppendTo?: HTMLElement | (() => HTMLElement) | 'parent' | 'inline';
  isLabelAndValueNotSame?: boolean;
}

export interface IDropdownOption {
  value?: string;
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
  menuAppendTo,
  isLabelAndValueNotSame,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>();

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect: DropdownProps['onSelect'] = (e) => {
    if (e && e.currentTarget.textContent) {
      let value: string = e.currentTarget.textContent;
      if (onSelectOption && value) {
        value = isLabelAndValueNotSame ? value.toLowerCase() : value;
        onSelectOption(value, name);
      }
      setIsOpen((isOpen) => !isOpen);
    }
  };

  const getItems = (options: IDropdownOption[]) => {
    return options.map(({ key, value, label }) => (
      <DropdownItem key={key} value={value}>
        {label || value}
      </DropdownItem>
    ));
  };

  const getSelectedValue = () => {
    if (isLabelAndValueNotSame) {
      const filteredOption = items?.filter((item) => item.value === value)[0];
      return filteredOption?.label;
    }
    return value;
  };

  const dropdownToggle = (
    <DropdownToggle
      id={toggleId}
      onToggle={onToggle}
      toggleIndicator={CaretDownIcon}
    >
      {getSelectedValue()}
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
      menuAppendTo={menuAppendTo}
    />
  );
};
