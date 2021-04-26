import React, { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { Given, When, Then, Fusion } from 'jest-cucumber-fusion';
import { TopicAdvanceConfig } from '../../../../Modules/Topics/CreateTopic/Components/TopicAdvanceConfig';
import kafkai18n from '../../../../../test-utils/i18n';
import { I18nextProvider } from 'react-i18next';

let renderResult: RenderResult;
let component: ReactElement;

const initialState = {
  name: '',
  numPartitions: '',
  'retention.ms': '',
  'retention.ms.unit': 'milliseconds',
  'retention.bytes': '',
  'retention.bytes.unit': 'bytes',
  'cleanup.policy': '',
};

Given('the create topic advanced wizard component', () => {
  component = (
    <I18nextProvider i18n={kafkai18n}>
      <TopicAdvanceConfig
        isCreate={true}
        saveTopic={jest.fn()}
        handleCancel={jest.fn()}
        topicData={initialState}
        setTopicData={jest.fn()}
      />
    </I18nextProvider>
  );
});

When('it is rendered', () => {
  renderResult = render(component);
});

Then('it should display the expected text', () => {
  const { getByText } = renderResult;
  expect(getByText('JUMP TO SECTION')).toBeInTheDocument();
});

Fusion('TopicAdvanced.feature');
