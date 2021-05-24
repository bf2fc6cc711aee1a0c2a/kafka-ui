import { Popover, TextContent, Text, FormGroup, TextInput } from '@patternfly/react-core';
import React from 'react';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import bytes from 'bytes';
import humanizeDuration from 'humanize-duration';

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
  /** Unit (if exists) for the field */
  unit?: string;
  /** Indicates if unlimited should be shown for negative numbers */
  showUnlimited?: boolean;
}

export const TextWithLabelPopover: React.FC<TextWithLabelPopoverProps> = ({
  fieldLabel,
  btnAriaLabel,
  fieldValue,
  popoverBody,
  popoverHeader,
  unit,
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
    if (unit) {
      if (unit === 'ms') {
        displayText = humanizeDuration(Number(fieldValue));
      }
      if (unit === 'bytes') {
        displayText = bytes(Number(fieldValue), { unitSeparator: ' ' });
      }
    } else {
      displayText = fieldValue;
    }
  }

  return (
    <FormGroup
    // fieldId={fieldId}
    fieldId="DEBUG"
    label={fieldLabel}
    className="kafka-ui-form-group--readonly"
    labelIcon={
      <Popover
      headerContent={<div>{popoverHeader}</div>}
      bodyContent={<div>{popoverBody}</div>}
    >
      <button
        aria-label={btnAriaLabel}
        onClick={preventButtonSubmit}
        className='pf-c-form__group-label-help'
      >
        <HelpIcon noVerticalAlign />
      </button>
    </Popover>
    }>
      <TextInput isReadOnly type="text" id="simple-form-note-01" name="simple-form-number" value={displayText} />
    </FormGroup>
  );
};
