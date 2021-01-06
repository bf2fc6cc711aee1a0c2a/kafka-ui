/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { render, RenderResult } from '@testing-library/react';
import { StepReplicas, IStepReplicas } from './StepReplicas.patternfly';
import React, { ReactElement } from 'react';

let renderResult: RenderResult;
let component: ReactElement;

const replicasProps: IStepReplicas = {
  setMinInSyncReplicaTouchspinValue: jest.fn(),
  setReplicationFactorTouchspinValue: jest.fn(),
  minInSyncReplicaTouchspinValue: 1,
  replicationFactorTouchspinValue: 1,
};

describe('Step Replicas', () => {
  it('should render Replicas step component', () => {
    component = <StepReplicas {...replicasProps} />;
    renderResult = render(component);
    const { getByText } = renderResult;
    expect(
      getByText(
        'This is how many copies of a topic will be made for high availability.'
      )
    ).toBeInTheDocument();
  });
});
