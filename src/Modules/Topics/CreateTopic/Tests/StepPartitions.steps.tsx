import { render, RenderResult } from '@testing-library/react';
import {
  StepPartitions,
  IStepPartitions,
} from '../../../../Modules/Topics/CreateTopic/Components/StepPartitions';
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
    expect(getByText('An ordered list of messages')).toBeInTheDocument();
    expect(
      getByText(
        'One or more partitions make up a topic. Partitions are distributed across the brokers to increase the scalability of your topic. You can also use them to distribute messages across the members of the consumer group.'
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
