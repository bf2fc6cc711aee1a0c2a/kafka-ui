/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { render, RenderResult } from '@testing-library/react';
import { StepPartitions, IStepPartitions } from './StepPartitions.patternfly';
import React, { ReactElement } from 'react';

let renderResult: RenderResult;
let component: ReactElement;

const partitionsProps: IStepPartitions = {
  partitionTouchspinValue: 1,
  setPartitionTouchspinValue: jest.fn(),
};

describe('Step Partitions', () => {
  it('should render Partitions step component', () => {
    component = <StepPartitions {...partitionsProps} />;
    renderResult = render(component);
    const { getByText } = renderResult;
    expect(
      getByText(
        'One or more partitions make up a topic. A partition is an ordered list of messages.'
      )
    ).toBeInTheDocument();
  });
});
