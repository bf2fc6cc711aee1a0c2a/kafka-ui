import React from 'react';
import { PageSection } from '@patternfly/react-core';
import { PermissionsTableView } from '@app/modules/Permissions/pages/PermissionsTable/PermissionsTableView';
import { ModalProvider } from '@rhoas/app-services-ui-components';
import {
  MainViewHeader,
  KafkaModalLoader,
  PaginationProvider,
} from '@app/components';
import {
  FederatedProps,
  FederatedContext,
  ConfigContext,
  IConfiguration,
} from '@app/contexts';
import { useModal, ModalType } from '@rhoas/app-services-ui-shared';

type PermissionsFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

const PermissionsFederated: React.FC<PermissionsFederatedProps> = ({
  kafkaName,
  kafkaPageLink,
  handleInstanceDrawer,
  redirectAfterDeleteInstance,
  kafka,
  onError,
  apiBasePath,
  getToken,
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
    <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
      <FederatedContext.Provider
        value={{
          kafkaName,
          kafkaPageLink,
          handleInstanceDrawer,
          kafka,
          redirectAfterDeleteInstance,
          onError,
          onDeleteInstance,
        }}
      >
        <ModalProvider>
          <PaginationProvider>
            <MainViewHeader activeTabKey={4} />
            <PageSection hasOverflowScroll={true}>
              <PermissionsTableView kafkaName={kafkaName} />
              <KafkaModalLoader />
            </PageSection>
          </PaginationProvider>
        </ModalProvider>
      </FederatedContext.Provider>
    </ConfigContext.Provider>
  );
};

export default PermissionsFederated;
