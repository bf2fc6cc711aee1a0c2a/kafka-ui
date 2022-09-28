import { PageSection } from '@patternfly/react-core';
import React from 'react';
import { MainViewHeader } from '@app/components';
import { FederatedProps, FederatedContext } from '@app/contexts';
import { useModal, ModalType } from '@rhoas/app-services-ui-shared';

export type SettingsProps = FederatedProps;

const Settings: React.FC<SettingsProps> = ({
  showSettings,
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
        kafka,
        handleInstanceDrawer,
        redirectAfterDeleteInstance,
        onDeleteInstance,
      }}
    >
      <MainViewHeader activeTabKey={5} />
      {showSettings}
    </FederatedContext.Provider>
  );
};

export { Settings };
export default Settings;
