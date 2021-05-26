import { render, RenderResult } from '@testing-library/react';
import {
  StepMessageRetention,
  IStepMessageRetention,
} from '../Components/StepMessageRetention';
import React, { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import kafkai18n from '../../../../../test-utils/i18n';

const messageRetentionProps: IStepMessageRetention = {
  setMsgRetentionValue: jest.fn(),
  currentPeriod: 1,
  currentSize: 'custom',
  setCurrentPeriod: jest.fn(),
  setCurrentSize: jest.fn(),
  setRetentionSize: jest.fn(),
};

const setup = () => {
  const component: ReactElement = (
    <I18nextProvider i18n={kafkai18n}>
      <StepMessageRetention {...messageRetentionProps} />
    </I18nextProvider>
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

  xit('should handle plus and minus actions', () => {
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
    const { setCurrentPeriod } = messageRetentionProps;
    userEvent.click(getByLabelText('A day'));
    expect(setCurrentPeriod).toHaveBeenCalled();
    expect(setCurrentPeriod).toBeCalledTimes(1);
    userEvent.click(getByLabelText('A week'));
    expect(setCurrentPeriod).toHaveBeenCalled();
    expect(setCurrentPeriod).toBeCalledTimes(2);
  });
});
