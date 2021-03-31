import { render, RenderResult } from '@testing-library/react';
import {
  StepReplicas,
  IStepReplicas,
} from '../../../../Modules/Topics/CreateTopic/Components/StepReplicas';
import React, { ReactElement } from 'react';

const replicasProps: IStepReplicas = {
  minInSyncReplica: 1,
  replicationFactor: 1,
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
        'How many copies of a topic will be made for high availability.'
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        'The partitions of each topic can be replicated across a configurable number of brokers.'
      )
    ).toBeInTheDocument();
  });
});
