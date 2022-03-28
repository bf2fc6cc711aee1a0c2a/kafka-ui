import { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { StepTopicName, StepTopicNameProps } from './StepTopicName';

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
  const component: ReactElement = <StepTopicName {...topicNameProps} />;
  const renderResult: RenderResult = render(component);
  return renderResult;
};

describe('Step Topic Name', () => {
  const renderResult = setup();
  it('should render topic name step component', () => {
    const { getByText, getByPlaceholderText } = renderResult;
    expect(getByText('topic.topic_name_info')).toBeInTheDocument();
    expect(getByText('topic.topic_name_info_note')).toBeInTheDocument();
    expect(getByPlaceholderText('topic.enter_name')).toBeInTheDocument();
  });
});
