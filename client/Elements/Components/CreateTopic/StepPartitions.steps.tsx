/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { render, RenderResult } from '@testing-library/react';
import { StepPartitions, IStepPartitions } from './StepPartitions.patternfly';
import React, { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';

const partitionsProps: IStepPartitions = {
  partitionTouchspinValue: 1,
  setPartitionTouchspinValue: jest.fn(),
};

const setup = () => {
  const component: ReactElement = <StepPartitions {...partitionsProps} />;
  const renderResult: RenderResult = render(component);
  return renderResult;
};

describe('Step Partitions', () => {
  it('should render Partitions step component', () => {
    const renderResult = setup();
    const { getByText } = renderResult;
    expect(
      getByText(
        'One or more partitions make up a topic. A partition is an ordered list of messages.'
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        'Partitions are distributed across the brokers in order to increase the scalability of your topic. You can also use them to distribute messages across the members of a consumer group.'
      )
    ).toBeInTheDocument();
  });

  it('should handle plus and minus actions', () => {
    const renderResult = setup();
    const { setPartitionTouchspinValue } = partitionsProps;
    const { getByRole } = renderResult;
    userEvent.click(getByRole('button', { name: /Plus/i }));
    expect(setPartitionTouchspinValue).toHaveBeenCalled();
    expect(setPartitionTouchspinValue).toBeCalledTimes(1);
    userEvent.click(getByRole('button', { name: /Minus/i }));
    expect(setPartitionTouchspinValue).toHaveBeenCalled();
    expect(setPartitionTouchspinValue).toBeCalledTimes(2);
  });
});
