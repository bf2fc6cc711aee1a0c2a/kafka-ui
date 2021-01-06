/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { render, RenderResult } from '@testing-library/react';
import {
  StepMessageRetention,
  IStepMessageRetention,
} from './StepMessageRetention.patternfly';
import React, { ReactElement } from 'react';

let renderResult: RenderResult;
let component: ReactElement;

const messageRetentionProps: IStepMessageRetention = {
  setMsgRetentionValue: jest.fn(),
};

describe('Step Message Retention', () => {
  it('should render Message Retention step component', () => {
    component = <StepMessageRetention {...messageRetentionProps} />;
    renderResult = render(component);
    const { getByText } = renderResult;
    expect(
      getByText(
        'This is how long messages are retained before they are deleted.'
      )
    ).toBeInTheDocument();
  });
});
