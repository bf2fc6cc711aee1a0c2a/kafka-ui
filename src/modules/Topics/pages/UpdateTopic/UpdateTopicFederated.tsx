import { FunctionComponent } from 'react';
import { UpdateTopicPage } from '@app/modules/Topics/pages/UpdateTopic';
import {
  ConfigContext,
  FederatedContext,
  FederatedProps,
  IConfiguration,
} from '@app/contexts';
import { KafkaModalLoader, PaginationProvider } from '@app/components';
import { ModalProvider } from '@rhoas/app-services-ui-components';

export type UpdateTopicFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

const UpdateTopicFederated: FunctionComponent<UpdateTopicFederatedProps> = ({
  getToken,
  apiBasePath,
  kafkaName,
  kafkaPageLink,
  kafkaInstanceLink,
  onError,
  kafka,
}) => {
  const { replication_factor, min_in_sync_replicas } = kafka || {};

  return (
    <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
      <FederatedContext.Provider
        value={{
          activeTab: 1,
          kafkaName,
          kafkaPageLink,
          kafkaInstanceLink,
          onError,
          kafka: {},
          replicationFactor: replication_factor,
          minInSyncReplicas: min_in_sync_replicas,
        }}
      >
        <ModalProvider>
          <PaginationProvider>
            <UpdateTopicPage />
          </PaginationProvider>
          <KafkaModalLoader />
        </ModalProvider>
      </FederatedContext.Provider>
    </ConfigContext.Provider>
  );
};

export default UpdateTopicFederated;
