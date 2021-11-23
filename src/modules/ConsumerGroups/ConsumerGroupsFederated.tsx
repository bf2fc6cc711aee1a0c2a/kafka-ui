import React from 'react';
import { PageSection } from '@patternfly/react-core';
import { ConsumerGroups } from './ConsumerGroups';
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

type ConsumerGroupsFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

const ConsumerGroupsFederated: React.FC<ConsumerGroupsFederatedProps> = ({
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
              <MainViewHeader activeTabKey={3} />
              <PageSection isFilled>
                <ConsumerGroups consumerGroupByTopic={false} />
                <KafkaModalLoader />
              </PageSection>
            </PaginationProvider>
          </ModalProvider>
        </FederatedContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default ConsumerGroupsFederated;
