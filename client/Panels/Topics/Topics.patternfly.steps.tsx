/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { Fusion, Given, Then, When } from 'jest-cucumber-fusion';
import { render, RenderResult } from '@testing-library/react';
import React, { ReactElement } from 'react';
import Topics from './View.patternfly';

let renderResult: RenderResult;
let component: ReactElement;

Given('a Topics component', () => {
  component = <Topics />;
});

When('it is rendered', () => {
  renderResult = render(component);
});

Then('it should display the topics element', () => {
  const { getByText } = renderResult;
  expect(getByText('Create topic')).toBeInTheDocument();
});

Fusion('Topics.feature');
