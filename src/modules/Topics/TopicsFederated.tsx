import React from 'react';
import { PageSection } from '@patternfly/react-core';
import { Topics } from './Topics';
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
            <MainViewHeader activeTabKey={2} />
            <PageSection isFilled>
              <Topics />
              <KafkaModalLoader />
            </PageSection>
          </PaginationProvider>
        </ModalProvider>
      </FederatedContext.Provider>
    </ConfigContext.Provider>
  );
};

export default TopicsFederated;
