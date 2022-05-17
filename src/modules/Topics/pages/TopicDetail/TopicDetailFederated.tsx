import { FunctionComponent } from 'react';
import { TopicDetailPage } from '@app/modules/Topics/pages/TopicDetail';
import {
  ConfigContext,
  FederatedContext,
  FederatedProps,
  IConfiguration,
} from '@app/contexts';
import { KafkaModalLoader, PaginationProvider } from '@app/components';
import { ModalProvider } from '@rhoas/app-services-ui-components';

export type TopicDetailFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

const TopicDetailFederated: FunctionComponent<TopicDetailFederatedProps> = ({
  getToken,
  apiBasePath,
  kafkaName,
  onError,
  kafkaPageLink,
  kafkaInstanceLink,
  showSchemas,
  kafka,
}) => {
  const { replicationFactor, minInSyncReplicas } = kafka || {};

  return (
    <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
      <FederatedContext.Provider
        value={{
          kafka: undefined,
          activeTab: 2,
          onError,
          kafkaName,
          kafkaPageLink,
          kafkaInstanceLink,
          showSchemas,
          replicationFactor,
          minInSyncReplicas,
        }}
      >
        <ModalProvider>
          <PaginationProvider>
            <TopicDetailPage />
          </PaginationProvider>
          <KafkaModalLoader />
        </ModalProvider>
      </FederatedContext.Provider>
    </ConfigContext.Provider>
  );
};

export default TopicDetailFederated;
