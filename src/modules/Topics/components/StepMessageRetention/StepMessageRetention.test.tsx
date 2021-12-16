import React, { ReactElement } from 'react';
// import userEvent from "@testing-library/user-event";
import { render, RenderResult } from '@testing-library/react';
import {
  StepMessageRetention,
  StepMessageRetentionProps,
} from './StepMessageRetention';

const messageRetentionProps: StepMessageRetentionProps = {
  topicData: { name: 'test', numPartitions: '2' },
  setTopicData: jest.fn(),
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
    expect(getByText('topic.message_retention_info')).toBeInTheDocument();
    expect(getByText('topic.message_retention_info_note')).toBeInTheDocument();
  });

  xit('should handle plus and minus actions', () => {
    // const renderResult = setup();
    // const { setMsgRetentionValue } = messageRetentionProps;
    // const { getByRole } = renderResult;
    // userEvent.click(getByRole("button", { name: /Plus/i }));
    // expect(setMsgRetentionValue).toHaveBeenCalled();
    // expect(setMsgRetentionValue).toBeCalledTimes(2);
    // userEvent.click(getByRole("button", { name: /Minus/i }));
    // expect(setMsgRetentionValue).toHaveBeenCalled();
    // expect(setMsgRetentionValue).toBeCalledTimes(3);
  });

  xit('should handle message retention radio clicks ', () => {
    // const { getByLabelText } = setup();
    // const { setCurrentPeriod } = messageRetentionProps;
    // userEvent.click(getByLabelText("A day"));
    // expect(setCurrentPeriod).toHaveBeenCalled();
    // expect(setCurrentPeriod).toBeCalledTimes(1);
    // userEvent.click(getByLabelText("A week"));
    // expect(setCurrentPeriod).toHaveBeenCalled();
    // expect(setCurrentPeriod).toBeCalledTimes(2);
  });
});
