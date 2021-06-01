import React, { FunctionComponent } from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
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
import { RootModal } from "@app/components/RootModal";

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
    <BrowserRouter>
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
              <RootModal>
                <TopicDetailPage updateTopic={updateTopic} />
              </RootModal>
            </FederatedContext.Provider>
          </AlertContext.Provider>
        </ConfigContext.Provider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

export default TopicDetailFederated;
