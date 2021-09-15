import { Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import React from 'react';

type ConsumerGroupPopoverProps = {
  title: string;
  description: string;
};

export const ConsumerGroupPopover = ({
  title,
  description,
}: ConsumerGroupPopoverProps) => {
  return (
    <Popover
      aria-label='Consumer groups popover'
      headerContent={<div>{title}</div>}
      bodyContent={<div>{description}</div>}
    >
      <OutlinedQuestionCircleIcon />
    </Popover>
  );
};
