/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { render, RenderResult } from '@testing-library/react';
import { StepReplicas, IStepReplicas } from './StepReplicas.patternfly';
import React, { ReactElement } from 'react';
// import userEvent from '@testing-library/user-event';

const replicasProps: IStepReplicas = {
  setMinInSyncReplicaTouchspinValue: jest.fn(),
  setReplicationFactorTouchspinValue: jest.fn(),
  minInSyncReplicaTouchspinValue: 1,
  replicationFactorTouchspinValue: 1,
};
const setup = () => {
  const component: ReactElement = <StepReplicas {...replicasProps} />;
  const renderResult: RenderResult = render(component);
  return renderResult;
};
describe('Step Replicas', () => {
  it('should render Replicas step component', () => {
    const { getByText } = setup();
    expect(
      getByText(
        'This is how many copies of a topic will be made for high availability.'
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        'The partitions of each topic can be replicated across a configurable number of brokers.'
      )
    ).toBeInTheDocument();
  });

  //WIP: Tests for replicas
  // it('should handle radio, plus and minus actions', () => {
  //   const renderResult = setup();
  //   const {
  //     setMinInSyncReplicaTouchspinValue,
  //     setReplicationFactorTouchspinValue,
  //   } = replicasProps;
  //   const { getByRole } = renderResult;
  //   userEvent.click(getByRole('button', { name: /Plus/i }));
  //   expect(setMinInSyncReplicaTouchspinValue).toHaveBeenCalled();
  //   expect(setMinInSyncReplicaTouchspinValue).toBeCalledTimes(1);
  //   userEvent.click(getByRole('button', { name: /Minus/i }));
  //   expect(setMinInSyncReplicaTouchspinValue).toHaveBeenCalled();
  //   expect(setMinInSyncReplicaTouchspinValue).toBeCalledTimes(2);

  //   userEvent.click(getByRole('button', { name: /Plus/i }));
  //   expect(setReplicationFactorTouchspinValue).toHaveBeenCalled();
  //   expect(setReplicationFactorTouchspinValue).toBeCalledTimes(1);
  //   userEvent.click(getByRole('button', { name: /Minus/i }));
  //   expect(setReplicationFactorTouchspinValue).toHaveBeenCalled();
  //   expect(setReplicationFactorTouchspinValue).toBeCalledTimes(2);
  // });
});
