/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { Popover, TextContent, Text } from '@patternfly/react-core';
import React from 'react';
import { HelpIcon } from '@patternfly/react-icons';

import './TextWithLabelPopover.patternfly.css';

export interface TextWithLabelPopoverProps {
  /** Field label */
  fieldLabel: string;
  /** Field value */
  fieldValue: string | number | boolean;
  /** Header text for popover label */
  popoverHeader: string;
  /** Body text for popover label */
  popoverBody: string;
  /** Aria label for popover button */
  btnAriaLabel: string;
  /** Unit (if exists) for the field */
  unit?: string;
}

export const TextWithLabelPopover: React.FC<TextWithLabelPopoverProps> = ({
  fieldLabel,
  btnAriaLabel,
  fieldValue,
  popoverBody,
  popoverHeader,
  unit,
}) => {
  const preventButtonSubmit = (event) => event.preventDefault();

  let displayText: string;

  if (typeof fieldValue === 'boolean') {
    if (fieldValue) displayText = 'Enabled';
    else displayText = 'Disabled';
  } else {
    if (unit) displayText = `${fieldValue} ${unit}`;
    else displayText = fieldValue.toString();
  }

  return (
    <TextContent className='text-content-padding'>
      <Text style={{ fontWeight: 700, display: 'inline' }}>{fieldLabel}</Text>
      <Popover
        headerContent={<div>{popoverHeader}</div>}
        bodyContent={<div>{popoverBody}</div>}
      >
        <button
          aria-label={btnAriaLabel}
          onClick={preventButtonSubmit}
          className='pf-c-form__group-label-help'
          style={{ position: 'relative', left: '5px', top: '2px' }}
        >
          <HelpIcon noVerticalAlign />
        </button>
      </Popover>
      <Text>{displayText}</Text>
    </TextContent>
  );
};
