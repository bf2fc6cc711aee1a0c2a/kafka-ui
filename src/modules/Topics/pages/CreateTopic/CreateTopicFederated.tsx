import { FunctionComponent } from 'react';
import { CreateTopicPage } from '@app/modules/Topics/pages/CreateTopic/CreateTopicPage';
import {
  FederatedContext,
  FederatedProps,
  ConfigContext,
  IConfiguration,
} from '@app/contexts';
import { ModalProvider } from '@rhoas/app-services-ui-components';

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
  const { replicationFactor, minInSyncReplicas, multi_az } = kafka || {};

  return (
    <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
      <FederatedContext.Provider
        value={{
          kafkaName,
          kafkaPageLink,
          kafkaInstanceLink,
          kafka: undefined,
          replicationFactor,
          minInSyncReplicas,
          isMultiAZ: multi_az,
        }}
      >
        <ModalProvider>
          <CreateTopicPage />
        </ModalProvider>
      </FederatedContext.Provider>
    </ConfigContext.Provider>
  );
};

export default CreateTopicFederated;
