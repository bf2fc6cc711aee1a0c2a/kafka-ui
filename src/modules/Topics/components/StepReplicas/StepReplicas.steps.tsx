import React, { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import {
  StepReplicas,
  IStepReplicas,
} from './StepReplicas';
import kafkai18n from '@test-utils/i18n';

const replicasProps: IStepReplicas = {
  minInSyncReplica: 1,
  replicationFactor: 1,
};

const setup = () => {
  const component: ReactElement = (
    <I18nextProvider i18n={kafkai18n}>
      <StepReplicas {...replicasProps} />
    </I18nextProvider>
  );
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
