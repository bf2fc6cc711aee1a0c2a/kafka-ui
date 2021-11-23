import React from 'react';
import { PageSection } from '@patternfly/react-core';
import { Topics } from './Topics';
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
import './pages/style.css';

type TopicsFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

const TopicsFederated: React.FC<TopicsFederatedProps> = ({
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
              <MainViewHeader activeTabKey={2} />
              <PageSection isFilled>
                <Topics />
                <KafkaModalLoader />
              </PageSection>
            </PaginationProvider>
          </ModalProvider>
        </FederatedContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default TopicsFederated;
