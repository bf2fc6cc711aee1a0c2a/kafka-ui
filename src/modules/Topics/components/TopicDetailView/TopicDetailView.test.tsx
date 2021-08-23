import React, { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { TopicDetailView, TopicViewDetailProps } from './TopicDetailView';
import { I18nextProvider } from 'react-i18next';
import kafkai18n from '@test-utils/i18n';
import { IAdvancedTopic } from '@app/modules/Topics/components/CreateTopicWizard';

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
  deleteTopic
};

const setup = () => {
  const component: ReactElement = (
    <I18nextProvider i18n={kafkai18n}>
      <TopicDetailView {...props} />
    </I18nextProvider>
  );
  const renderResult: RenderResult = render(component);
  return renderResult;
};

describe('<TopicDetailView />', () => {
  xit('should render TopicDetailView', () => {
    const renderResult = setup();
    const { getByText } = renderResult;
    expect(getByText('JUMP TO SECTION')).toBeInTheDocument();
  });
});
