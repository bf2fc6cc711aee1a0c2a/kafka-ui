import React from 'react';
import { I18nextProvider } from 'react-i18next';
import kafkai18n from '@app/i18n';
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
    <I18nextProvider i18n={kafkai18n}>
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
    </I18nextProvider>
  );
};

export { Dashboard };
export default Dashboard;
