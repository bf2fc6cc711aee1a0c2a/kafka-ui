import React, { FunctionComponent } from 'react';
import { I18nextProvider } from 'react-i18next';
import { UpdateTopicPage } from '@app/modules/Topics/pages/UpdateTopic';
import {
  ConfigContext,
  FederatedContext,
  FederatedProps,
  IConfiguration,
} from '@app/contexts';
import kafkai18n from '@app/i18n';
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
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
        <FederatedContext.Provider
          value={{
            activeTab: 1,
            kafkaName,
            kafkaPageLink,
            kafkaInstanceLink,
            onError,
          }}
        >
          <ModalProvider>
            <UpdateTopicPage />
            <KafkaModalLoader />
          </ModalProvider>
        </FederatedContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default UpdateTopicFederated;
