/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { render, RenderResult } from '@testing-library/react';
import { StepTopicName, IStepTopicName } from './StepTopicName.patternfly';
import React, { ReactElement } from 'react';

const setup = () => {
  const topicNameProps: IStepTopicName = {
    topicNameInput: '',
    setTopicNameInput: jest.fn(),
  };
  const component: ReactElement = <StepTopicName {...topicNameProps} />;
  const renderResult: RenderResult = render(component);
  return renderResult;
};

describe('Step Topic Name', () => {
  const renderResult = setup();
  it('should render topic name step component', () => {
    const { getByText, getByPlaceholderText } = renderResult;
    expect(
      getByText('This is the unique name used to recognize your topic.')
    ).toBeInTheDocument();
    expect(
      getByText(
        'It will also be used by your producers and consumers as part of the connection information, so make it something easy to recognize.'
      )
    ).toBeInTheDocument();
    expect(getByPlaceholderText('Enter topic name')).toBeInTheDocument();
  });
});
