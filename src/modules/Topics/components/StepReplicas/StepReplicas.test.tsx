import { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { StepReplicas, StepReplicasProps } from './StepReplicas';

const replicasProps: StepReplicasProps = {
  minInSyncReplica: 1,
  replicationFactor: 1,
  isMultiAZ: true,
};

const setup = () => {
  const component: ReactElement = <StepReplicas {...replicasProps} />;
  const renderResult: RenderResult = render(component);
  return renderResult;
};
describe('Step Replicas', () => {
  it('should render Replicas step component', () => {
    const { getByText } = setup();
    expect(getByText('topic.replicas_info')).toBeInTheDocument();
    expect(getByText('topic.replicas_detail')).toBeInTheDocument();
  });
});
