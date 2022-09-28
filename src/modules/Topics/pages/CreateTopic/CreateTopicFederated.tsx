import { FunctionComponent } from 'react';
import {
  FederatedContext,
  FederatedProps,
  ConfigContext,
  IConfiguration,
} from '@app/contexts';
import { ModalProvider } from '@rhoas/app-services-ui-components';
import { CreateTopic } from './CreateTopic';

export type CreateTopicFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

const CreateTopicFederated: FunctionComponent<CreateTopicFederatedProps> = ({
  getToken,
  apiBasePath,
  kafkaName,
  kafkaPageLink,
  kafkaInstanceLink,
  kafka,
}) => {
  const { replication_factor, min_in_sync_replicas } = kafka?.size || {};

  return (
    <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
      <FederatedContext.Provider
        value={{
          kafkaName,
          kafkaPageLink,
          kafkaInstanceLink,
          kafka: {},
          replicationFactor: replication_factor,
          minInSyncReplicas: min_in_sync_replicas,
          isMultiAZ: kafka?.multi_az,
        }}
      >
        <ModalProvider>
          <CreateTopic />
        </ModalProvider>
      </FederatedContext.Provider>
    </ConfigContext.Provider>
  );
};

export default CreateTopicFederated;
