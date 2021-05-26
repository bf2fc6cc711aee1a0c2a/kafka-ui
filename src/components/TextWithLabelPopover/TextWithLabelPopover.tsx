import { Popover, TextContent, Text } from '@patternfly/react-core';
import React from 'react';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';

import './TextWithLabelPopover.css';

export interface TextWithLabelPopoverProps {
  /** Field label */
  fieldLabel: string;
  /** Field value */
  fieldValue?: string;
  /** Header text for popover label */
  popoverHeader: string;
  /** Body text for popover label */
  popoverBody: string;
  /** Aria label for popover button */
  btnAriaLabel: string;
  /** Indicates if unlimited should be shown for negative numbers */
  showUnlimited?: boolean;
}

export const TextWithLabelPopover: React.FC<TextWithLabelPopoverProps> = ({
  fieldLabel,
  btnAriaLabel,
  fieldValue,
  popoverBody,
  popoverHeader,
  showUnlimited,
}) => {
  const preventButtonSubmit = (event) => event.preventDefault();

  let displayText = '-';

  if (
    showUnlimited === true &&
    fieldValue !== undefined &&
    parseInt(fieldValue) < 0
  ) {
    displayText = 'Unlimited';
  } else if (fieldValue) {
    displayText = fieldValue;
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
