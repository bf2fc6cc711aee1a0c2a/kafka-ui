/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { FormGroup, Popover } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import React from 'react';

interface IFormGroupWithPopoverProps {
  children: React.ReactNode;
  labelHead: string;
  fieldId: string;
  fieldLabel: string;
  labelBody: string;
  buttonAriaLabel: string;
}

export const FormGroupWithPopover: React.FC<IFormGroupWithPopoverProps> = ({
  children,
  labelHead,
  fieldId,
  fieldLabel,
  labelBody,
  buttonAriaLabel,
}) => {
  const preventButtonSubmit = (event) => event.preventDefault();

  return (
    <FormGroup
      fieldId={fieldId}
      label={fieldLabel}
      labelIcon={
        <Popover
          headerContent={<div>{labelHead}</div>}
          bodyContent={<div>{labelBody}</div>}
        >
          <button
            aria-label={buttonAriaLabel}
            onClick={preventButtonSubmit}
            className='pf-c-form__group-label-help'
          >
            <HelpIcon noVerticalAlign />
          </button>
        </Popover>
      }
    >
      {children}
    </FormGroup>
  );
};
