import React, { FunctionComponent } from "react";
import { I18nextProvider } from "react-i18next";
import { TopicDetailPage } from "@app/modules/Topics/pages/TopicDetail";
import {
  AlertContext,
  AlertContextProps,
  FederatedContext,
  FederatedProps,
  ConfigContext,
  IConfiguration,
} from "@app/contexts";
import kafkai18n from "@app/i18n";
import { KafkaActions } from "@app/utils";

export type TopicDetailFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

const TopicDetailFederated: FunctionComponent<TopicDetailFederatedProps> = ({
  getToken,
  apiBasePath,
  kafkaName,
  onError,
  addAlert,
  topicName,
  kafkaPageLink,
  kafkaInstanceLink,
  onConnectToRoute,
  getConnectToRoutePath,
  dispatchKafkaAction,
}) => {
  const alertContext = {
    addAlert,
  } as AlertContextProps;

  const updateTopic = () => {
    dispatchKafkaAction && dispatchKafkaAction(KafkaActions.UpdateTopic);
  };

  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
        <AlertContext.Provider value={alertContext}>
          <FederatedContext.Provider
            value={{
              activeTab: 2,
              onError,
              kafkaName,
              kafkaPageLink,
              kafkaInstanceLink,
              topicName,
              onConnectToRoute,
              getConnectToRoutePath,
              dispatchKafkaAction,
            }}
          >
            <TopicDetailPage updateTopic={updateTopic} />
          </FederatedContext.Provider>
        </AlertContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default TopicDetailFederated;
