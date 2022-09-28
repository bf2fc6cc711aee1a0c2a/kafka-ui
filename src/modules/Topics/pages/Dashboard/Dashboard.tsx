import { PageSection } from '@patternfly/react-core';
import React from 'react';
import { MainViewHeader } from '@app/components';
import { FederatedProps, FederatedContext } from '@app/contexts';
import { useModal, ModalType } from '@rhoas/app-services-ui-shared';

export type DashboardProps = FederatedProps;

const Dashboard: React.FC<DashboardProps> = ({
  showMetrics,
  kafkaName,
  kafkaPageLink,
  handleInstanceDrawer,
  redirectAfterDeleteInstance,
  kafka,
}) => {
  const { showModal } = useModal<ModalType.KasDeleteInstance>();

  const onDeleteInstance = () => {
    showModal &&
      showModal(ModalType.KasDeleteInstance, {
        kafka,
        onDelete: redirectAfterDeleteInstance,
      });
  };

  return (
    <FederatedContext.Provider
      value={{
        kafkaName,
        kafkaPageLink,
        handleInstanceDrawer,
        kafka,
        redirectAfterDeleteInstance,
        onDeleteInstance,
      }}
    >
      <MainViewHeader activeTabKey={1} />
      {showMetrics}
    </FederatedContext.Provider>
  );
};

export { Dashboard };
export default Dashboard;
