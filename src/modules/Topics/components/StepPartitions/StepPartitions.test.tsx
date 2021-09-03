import React, { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import kafkai18n from '@test-utils/i18n';
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
  const component: ReactElement = (
    <I18nextProvider i18n={kafkai18n}>
      <StepPartitions {...partitionsProps} />
    </I18nextProvider>
  );
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
