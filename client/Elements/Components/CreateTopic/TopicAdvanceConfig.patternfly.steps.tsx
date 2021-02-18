/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { Given, When, Then, Fusion } from 'jest-cucumber-fusion';
import { TopicAdvanceConfig } from './TopicAdvanceConfig.patternfly';
import { TopicContextProvider } from 'Contexts/Topic';

let renderResult: RenderResult;
let component: ReactElement;

Given('the create topic advanced wizard component', () => {
  component = (
    <TopicContextProvider>
      <TopicAdvanceConfig isCreate={true} saveTopic={jest.fn()} />
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
