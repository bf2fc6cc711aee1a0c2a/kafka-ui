import { render, RenderResult } from '@testing-library/react';
import {
  StepMessageRetention,
  IStepMessageRetention,
} from '../../../../Modules/Topics/CreateTopic/Components/StepMessageRetention';
import React, { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';

const messageRetentionProps: IStepMessageRetention = {
  setMsgRetentionValue: jest.fn(),
  currentPeriod: 1,
  setCurrentPeriod: jest.fn(),
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
        'How long messages are retained and the maximum total size of all log segments in a partition before they are deleted to free up space'
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        "Messages that aren't read by a consumer within this time will be missed. By default, a limit is only applied to retention time."
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
    expect(setMsgRetentionValue).toBeCalledTimes(1);
    userEvent.click(getByLabelText('A month'));
    expect(setMsgRetentionValue).toHaveBeenCalled();
    expect(setMsgRetentionValue).toBeCalledTimes(1);
  });
});
