import React, { FunctionComponent } from "react";
import { I18nextProvider } from "react-i18next";
import { TopicDetailPage } from "@app/modules/Topics/pages/TopicDetail";
import {
  AlertContext,
  AlertContextProps,
  FederatedContext,
  FederatedProps,
} from "@app/contexts";
import kafkai18n from "@app/i18n";

export type TopicDetailFederatedProps = FederatedProps;

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
    dispatchKafkaAction && dispatchKafkaAction("topic-update");
  };

  return (
    <I18nextProvider i18n={kafkai18n}>
      <AlertContext.Provider value={alertContext}>
        <FederatedContext.Provider
          value={{
            activeTab: 2,
            onError,
            kafkaName,
            kafkaPageLink,
            kafkaInstanceLink,
            topicName,
            getToken,
            apiBasePath,
            onConnectToRoute,
            getConnectToRoutePath,
            dispatchKafkaAction,
          }}
        >
          <TopicDetailPage updateTopic={updateTopic} />
        </FederatedContext.Provider>
      </AlertContext.Provider>
    </I18nextProvider>
  );
};

export default TopicDetailFederated;
