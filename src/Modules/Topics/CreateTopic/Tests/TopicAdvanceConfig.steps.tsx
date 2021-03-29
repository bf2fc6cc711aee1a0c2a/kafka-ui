import React, { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { Given, When, Then, Fusion } from 'jest-cucumber-fusion';
import { TopicAdvanceConfig } from '../../../../Modules/Topics/CreateTopic/Components/TopicAdvanceConfig';
import { TopicContextProvider } from '../../../../Contexts/Topic';

let renderResult: RenderResult;
let component: ReactElement;

Given('the create topic advanced wizard component', () => {
  component = (
    <TopicContextProvider>
      <TopicAdvanceConfig
        isCreate={true}
        saveTopic={jest.fn()}
        handleCancel={jest.fn()}
      />
    </TopicContextProvider>
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
