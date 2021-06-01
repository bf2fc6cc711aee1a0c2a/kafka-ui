import React, { FunctionComponent } from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { UpdateTopicPage } from "@app/modules/Topics/pages/UpdateTopic";
import {
  FederatedContext,
  FederatedProps,
  ConfigContext,
  IConfiguration,
} from "@app/contexts";
import kafkai18n from "@app/i18n";
import { AlertContext, AlertContextProps } from "@app/contexts/Alert";
import { KafkaActions } from "@app/utils";
import { RootModal } from "@app/components/RootModal";

export type UpdateTopicFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

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
    dispatchKafkaAction && dispatchKafkaAction(KafkaActions.UpdateTopic);
  };

  const onDeleteTopic = () => {
    onConnectToRoute && onConnectToRoute("");
  };

  const onSaveTopic = () => {
    dispatchKafkaAction && dispatchKafkaAction(KafkaActions.UpdateTopic);
  };

  return (
    <BrowserRouter>
      <I18nextProvider i18n={kafkai18n}>
        <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
          <AlertContext.Provider value={alertContext}>
            <FederatedContext.Provider
              value={{
                activeTab: 1,
                topicName,
                kafkaName,
                kafkaPageLink,
                kafkaInstanceLink,
                onError,
              }}
            >
              <RootModal>
                <UpdateTopicPage
                  onCancelUpdateTopic={onCancelUpdateTopic}
                  onDeleteTopic={onDeleteTopic}
                  onSaveTopic={onSaveTopic}
                />
              </RootModal>
            </FederatedContext.Provider>
          </AlertContext.Provider>
        </ConfigContext.Provider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

export default UpdateTopicFederated;
