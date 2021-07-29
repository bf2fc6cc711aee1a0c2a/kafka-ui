import React, { FunctionComponent } from 'react';
import { I18nextProvider } from 'react-i18next';
import { TopicDetailPage } from '@app/modules/Topics/pages/TopicDetail';
import {
  ConfigContext,
  FederatedContext,
  FederatedProps,
  IConfiguration,
} from '@app/contexts';
import kafkai18n from '@app/i18n';
import { ModalProvider } from '@app/components/KafkaModal';

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
}) => {
  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
        <FederatedContext.Provider
          value={{
            activeTab: 2,
            onError,
            kafkaName,
            kafkaPageLink,
            kafkaInstanceLink,
          }}
        >
          <ModalProvider>
            <TopicDetailPage />
          </ModalProvider>
        </FederatedContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default TopicDetailFederated;
