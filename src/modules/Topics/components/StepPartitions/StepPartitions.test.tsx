import React, { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';
import { render, RenderResult } from '@testing-library/react';
import { StepPartitions, StepPartitionsProps } from './StepPartitions';

const partitionsProps: StepPartitionsProps = {
  topicData: {
    name: '',
    numPartitions: '1',
    'retention.ms': '7',
    'retention.ms.unit': 'days',
    'retention.bytes': '-1',
    'retention.bytes.unit': 'bytes',
    'cleanup.policy': 'delete',
  },
  setTopicData: jest.fn(),
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
    expect(getByText('topic.partition_info')).toBeInTheDocument();
    expect(getByText('topic.partition_info_note')).toBeInTheDocument();
  });

  it('should handle plus and minus actions', () => {
    const renderResult = setup();
    const { setTopicData } = partitionsProps;
    const { getByRole } = renderResult;
    userEvent.click(getByRole('button', { name: /Plus/i }));
    expect(setTopicData).toHaveBeenCalled();
    expect(setTopicData).toBeCalledTimes(1);
    userEvent.click(getByRole('button', { name: /Minus/i }));
    expect(setTopicData).toHaveBeenCalled();
    expect(setTopicData).toBeCalledTimes(1);
  });
});
