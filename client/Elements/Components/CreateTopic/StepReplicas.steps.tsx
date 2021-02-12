/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { render, RenderResult } from '@testing-library/react';
import { StepReplicas, IStepReplicas } from './StepReplicas.patternfly';
import React, { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';

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

  it('should handle plus and minus actions', () => {
    const renderResult = setup();
    const {
      setMinInSyncReplicaTouchspinValue,
      setReplicationFactorTouchspinValue,
    } = replicasProps;
    const { getAllByRole } = renderResult;
    userEvent.click(getAllByRole('button', { name: /Plus/i })[1]);
    expect(setMinInSyncReplicaTouchspinValue).toHaveBeenCalled();
    expect(setMinInSyncReplicaTouchspinValue).toBeCalledTimes(1);
    userEvent.click(getAllByRole('button', { name: /Minus/i })[1]);
    expect(setMinInSyncReplicaTouchspinValue).toHaveBeenCalled();
    expect(setMinInSyncReplicaTouchspinValue).toBeCalledTimes(2);

    userEvent.click(getAllByRole('button', { name: /Plus/i })[0]);
    expect(setReplicationFactorTouchspinValue).toHaveBeenCalled();
    expect(setReplicationFactorTouchspinValue).toBeCalledTimes(1);
    userEvent.click(getAllByRole('button', { name: /Minus/i })[0]);
    expect(setReplicationFactorTouchspinValue).toHaveBeenCalled();
    expect(setReplicationFactorTouchspinValue).toBeCalledTimes(2);
  });

  xit('should handle replicas radio clicks ', () => {
    const { getByLabelText } = setup();
    const {
      setMinInSyncReplicaTouchspinValue,
      setReplicationFactorTouchspinValue,
    } = replicasProps;

    userEvent.click(getByLabelText('Replication factor: 2'));
    expect(setMinInSyncReplicaTouchspinValue).toHaveBeenCalled();
    expect(setMinInSyncReplicaTouchspinValue).toBeCalledTimes(1);
    expect(setReplicationFactorTouchspinValue).toHaveBeenCalled();
    expect(setReplicationFactorTouchspinValue).toBeCalledTimes(1);

    userEvent.click(getByLabelText('Replication factor: 1'));
    expect(setMinInSyncReplicaTouchspinValue).toHaveBeenCalled();
    expect(setMinInSyncReplicaTouchspinValue).toBeCalledTimes(2);
    expect(setReplicationFactorTouchspinValue).toHaveBeenCalled();
    expect(setReplicationFactorTouchspinValue).toBeCalledTimes(2);
  });
});
