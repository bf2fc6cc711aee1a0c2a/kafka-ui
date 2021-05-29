import React, { FunctionComponent } from "react";
import { I18nextProvider } from "react-i18next";
import { UpdateTopicPage } from "@app/modules/Topics/pages/UpdateTopic";
import { FederatedContext, FederatedProps } from "@app/contexts";
import kafkai18n from "@app/i18n";
import { AlertContext, AlertContextProps } from "@app/contexts/Alert";
import { kafkaActions } from "@app/utils";

export type UpdateTopicFederatedProps = FederatedProps;

const UpdateTopicFederated: FunctionComponent<UpdateTopicFederatedProps> = ({
  getToken,
  apiBasePath,
  topicName,
  kafkaName,
  kafkaPageLink,
  kafkaInstanceLink,
  addAlert,
  onError,
  dispatchKafkaAction,
  onConnectToRoute,
}) => {
  const alertContext = {
    addAlert,
  } as AlertContextProps;

  const onCancelUpdateTopic = () => {
    dispatchKafkaAction && dispatchKafkaAction(kafkaActions.TOPIC_UPDATE);
  };

  const onDeleteTopic = () => {
    onConnectToRoute && onConnectToRoute("");
  };

  const onSaveTopic = () => {
    dispatchKafkaAction && dispatchKafkaAction(kafkaActions.TOPIC_UPDATE);
  };

  return (
    <I18nextProvider i18n={kafkai18n}>
      <AlertContext.Provider value={alertContext}>
        <FederatedContext.Provider
          value={{
            activeTab: 1,
            topicName,
            kafkaName,
            kafkaPageLink,
            kafkaInstanceLink,
            onError,
            apiBasePath,
            getToken,
          }}
        >
          <UpdateTopicPage
            onCancelUpdateTopic={onCancelUpdateTopic}
            onDeleteTopic={onDeleteTopic}
            onSaveTopic={onSaveTopic}
          />
        </FederatedContext.Provider>
      </AlertContext.Provider>
    </I18nextProvider>
  );
};

export default UpdateTopicFederated;
