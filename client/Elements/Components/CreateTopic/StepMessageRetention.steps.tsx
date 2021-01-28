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
import userEvent from '@testing-library/user-event';

const messageRetentionProps: IStepMessageRetention = {
  setMsgRetentionValue: jest.fn(),
};

const setup = () => {
  const component: ReactElement = (
    <StepMessageRetention {...messageRetentionProps} />
  );
  const renderResult: RenderResult = render(component);
  return renderResult;
};

describe('Step Message Retention', () => {
  it('should render Message Retention step component', () => {
    const { getByText } = setup();
    expect(
      getByText(
        'This is how long messages are retained before they are deleted.'
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        'If your messages are not read by a consumer within this time, they will be missed.'
      )
    ).toBeInTheDocument();
  });

  it('should handle plus and minus actions', () => {
    const renderResult = setup();
    const { setMsgRetentionValue } = messageRetentionProps;
    const { getByRole } = renderResult;
    userEvent.click(getByRole('button', { name: /Plus/i }));
    expect(setMsgRetentionValue).toHaveBeenCalled();
    expect(setMsgRetentionValue).toBeCalledTimes(2);
    userEvent.click(getByRole('button', { name: /Minus/i }));
    expect(setMsgRetentionValue).toHaveBeenCalled();
    expect(setMsgRetentionValue).toBeCalledTimes(3);
  });

  it('should handle message retention radio clicks ', () => {
    const { getByLabelText } = setup();
    const { setMsgRetentionValue } = messageRetentionProps;
    userEvent.click(getByLabelText('A day'));
    expect(setMsgRetentionValue).toHaveBeenCalled();
    expect(setMsgRetentionValue).toBeCalledTimes(1);
    userEvent.click(getByLabelText('A week'));
    expect(setMsgRetentionValue).toHaveBeenCalled();
    expect(setMsgRetentionValue).toBeCalledTimes(2);
    userEvent.click(getByLabelText('A month'));
    expect(setMsgRetentionValue).toHaveBeenCalled();
    expect(setMsgRetentionValue).toBeCalledTimes(3);
  });
});
