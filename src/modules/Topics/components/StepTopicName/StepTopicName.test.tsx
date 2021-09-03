import React, { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import { StepTopicName, StepTopicNameProps } from '.';
import kafkai18n from '@test-utils/i18n';

const setup = () => {
  const topicNameProps: StepTopicNameProps = {
    topicNameValidated: 'default',
    setTopicNameValidated: jest.fn(),
    invalidText: '',
    setInvalidText: jest.fn(),
    setTopicData: jest.fn(),
    topicData: {
      name: '',
      numPartitions: '1',
      'retention.ms': '7',
      'retention.ms.unit': 'days',
      'retention.bytes': '-1',
      'retention.bytes.unit': 'bytes',
      'cleanup.policy': 'delete',
    },
  };
  const component: ReactElement = (
    <I18nextProvider i18n={kafkai18n}>
      <StepTopicName {...topicNameProps} />
    </I18nextProvider>
  );
  const renderResult: RenderResult = render(component);
  return renderResult;
};

describe('Step Topic Name', () => {
  const renderResult = setup();
  it('should render topic name step component', () => {
    const { getByText, getByPlaceholderText } = renderResult;
    expect(
      getByText('Unique name used to recognize your topic')
    ).toBeInTheDocument();
    expect(
      getByText(
        'The topic name is also used by your producers and consumers as part of the connection information, so make it something easy to recognize.'
      )
    ).toBeInTheDocument();
    expect(getByPlaceholderText('Enter topic name')).toBeInTheDocument();
  });
});
