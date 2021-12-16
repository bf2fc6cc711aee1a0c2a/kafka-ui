import React, { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { TopicDetailView, TopicViewDetailProps } from './TopicDetailView';
import { IAdvancedTopic } from '@app/modules/Topics/utils';

const topic: IAdvancedTopic = {
  name: 'SampleTopic2345',
  numPartitions: '52',
  'retention.ms': '78',
  'cleanup.policy': 'Delete',
  'retention.bytes': '-1',
};

const deleteTopic = jest.fn();
const props: TopicViewDetailProps = {
  topic,
  deleteTopic,
};

const setup = () => {
  const component: ReactElement = <TopicDetailView {...props} />;
  const renderResult: RenderResult = render(component);
  return renderResult;
};

describe('<TopicDetailView />', () => {
  xit('should render TopicDetailView', () => {
    const renderResult = setup();
    const { getByText } = renderResult;
    expect(getByText('topic.jump_to_section')).toBeInTheDocument();
  });
});
