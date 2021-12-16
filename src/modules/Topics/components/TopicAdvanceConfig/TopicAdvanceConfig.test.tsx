import React, { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import {
  TopicAdvanceConfigProps,
  TopicAdvanceConfig,
} from './TopicAdvanceConfig';
import { IAdvancedTopic } from '@app/modules/Topics/utils';
import { ModalContext } from '@rhoas/app-services-ui-shared';

const setup = () => {
  const topicData: IAdvancedTopic = {
    name: 'topicName',
    'cleanup.policy': 'Delete',
    numPartitions: '2',
    'retention.ms': '1000',
    'retention.bytes': '-1',
  };
  const topicadvanceConfigProps: TopicAdvanceConfigProps = {
    isCreate: true,
    saveTopic: jest.fn(),
    handleCancel: jest.fn(),
    topicData,
    setTopicData: jest.fn(),
  };
  const component: ReactElement = (
    <ModalContext.Provider
      value={{
        registerModals: () => '',
        showModal: () => '',
        hideModal: () => '',
      }}
    >
      <TopicAdvanceConfig {...topicadvanceConfigProps} />
    </ModalContext.Provider>
  );
  const renderResult: RenderResult = render(component);
  return renderResult;
};

describe('<TopicAdvancedConfig />', () => {
  it('should render topicadvancedConfig', () => {
    const renderResult = setup();
    const { getByText } = renderResult;
    expect(getByText('topic.jump_to_section')).toBeInTheDocument();
  });
});
