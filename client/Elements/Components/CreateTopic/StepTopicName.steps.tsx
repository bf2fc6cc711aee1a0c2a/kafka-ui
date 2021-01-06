/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { render, RenderResult } from '@testing-library/react';
import { StepTopicName, IStepTopicName } from './StepTopicName.patternfly';
import React, { ReactElement } from 'react';

let renderResult: RenderResult;
let component: ReactElement;

const topicNameProps: IStepTopicName = {
  topicNameInput: '',
  setTopicNameInput: jest.fn(),
};

describe('Step Topic Name', () => {
  it('should render topic name step component', () => {
    component = <StepTopicName {...topicNameProps} />;
    renderResult = render(component);
    const { getByText } = renderResult;
    expect(
      getByText('This is the unique name used to recognize your topic.')
    ).toBeInTheDocument();
  });
});
