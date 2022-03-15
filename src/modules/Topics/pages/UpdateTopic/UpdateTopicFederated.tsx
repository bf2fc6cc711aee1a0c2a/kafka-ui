import { FunctionComponent } from 'react';
import { UpdateTopicPage } from '@app/modules/Topics/pages/UpdateTopic';
import {
  ConfigContext,
  FederatedContext,
  FederatedProps,
  IConfiguration,
} from '@app/contexts';
import { KafkaModalLoader } from '@app/components/KafkaModal';
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
}) => {
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
        }}
      >
        <ModalProvider>
          <UpdateTopicPage />
          <KafkaModalLoader />
        </ModalProvider>
      </FederatedContext.Provider>
    </ConfigContext.Provider>
  );
};

export default UpdateTopicFederated;
