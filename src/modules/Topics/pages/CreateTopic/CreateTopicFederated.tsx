import React, { FunctionComponent } from 'react';
import { I18nextProvider } from 'react-i18next';
import { CreateTopicPage } from '@app/modules/Topics/pages/CreateTopic/CreateTopicPage';
import kafkai18n from '@app/i18n';
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
}) => {
  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
        <FederatedContext.Provider
          value={{
            kafkaName,
            kafkaPageLink,
            kafkaInstanceLink,
            kafka: {},
          }}
        >
          <ModalProvider>
            <CreateTopicPage />
          </ModalProvider>
        </FederatedContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default CreateTopicFederated;
