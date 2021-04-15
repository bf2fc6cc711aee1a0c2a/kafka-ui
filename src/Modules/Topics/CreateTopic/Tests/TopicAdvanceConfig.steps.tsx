import React, { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { Given, When, Then, Fusion } from 'jest-cucumber-fusion';
import { TopicAdvanceConfig } from '../../../../Modules/Topics/CreateTopic/Components/TopicAdvanceConfig';
import { initialState, TopicContextProvider } from '../../../../Contexts/Topic';
import kafkai18n from '../../../../../test-utils/i18n';
import { I18nextProvider } from 'react-i18next';

let renderResult: RenderResult;
let component: ReactElement;

Given('the create topic advanced wizard component', () => {
  component = (
    <I18nextProvider i18n={kafkai18n}>
      <TopicContextProvider>
        <TopicAdvanceConfig
          isCreate={true}
          saveTopic={jest.fn()}
          handleCancel={jest.fn()}
          topicData={initialState}
          setTopicData={jest.fn()}
        />
      </TopicContextProvider>
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
