import React from 'react';
import { PageSection } from '@patternfly/react-core';
import { PermissionsTableView } from '@app/modules/Permissions/pages/PermissionsTable/PermissionsTableView';
import { ModalProvider } from '@rhoas/app-services-ui-components';
import { I18nextProvider } from 'react-i18next';
import kafkai18n from '@app/i18n';
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
  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
        <FederatedContext.Provider
          value={{
            kafkaName,
            kafkaPageLink,
            handleInstanceDrawer,
            kafka,
            redirectAfterDeleteInstance,
            onError,
          }}
        >
          <ModalProvider>
            <PaginationProvider>
              <MainViewHeader activeTabKey={4} />
              <PageSection isFilled>
                <PermissionsTableView kafkaName={kafkaName} />
                <KafkaModalLoader />
              </PageSection>
            </PaginationProvider>
          </ModalProvider>
        </FederatedContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default PermissionsFederated;
