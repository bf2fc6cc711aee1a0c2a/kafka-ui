import React, { FunctionComponent } from "react";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import {
  FederatedContext,
  FederatedProps,
  ConfigContext,
  IConfiguration,
} from "@app/contexts";
import kafkai18n from "@app/i18n";
import { MainView } from "./MainView";
import { KafkaActions } from "@app/utils";
import { RootModal } from "@app/components/RootModal";

export type MainViewFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

const MainViewFederated: FunctionComponent<MainViewFederatedProps> = ({
  getToken,
  apiBasePath,
  kafkaName,
  kafkaPageLink,
  onError,
  onConnectToRoute,
  getConnectToRoutePath,
  handleInstanceDrawer,
  setIsOpenDeleteInstanceModal,
  dispatchKafkaAction,
}) => {
  const onCreateTopic = () => {
    dispatchKafkaAction && dispatchKafkaAction(KafkaActions.CreateTopic);
  };

  const onEditTopic = (topicName?: string | undefined) => {
    dispatchKafkaAction &&
      dispatchKafkaAction(KafkaActions.UpdateTopic, topicName);
  };

  return (
    // TODO don't add BrowserRouter here - see  https://github.com/bf2fc6cc711aee1a0c2a/mk-ui-frontend/issues/74
    <BrowserRouter>
      <I18nextProvider i18n={kafkai18n}>
        <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
          <FederatedContext.Provider
            value={{
              kafkaName,
              kafkaPageLink,             
              onError,
              onConnectToRoute,
              getConnectToRoutePath,
              handleInstanceDrawer,
              setIsOpenDeleteInstanceModal,
              dispatchKafkaAction,
            }}
          >
            <RootModal>
              <MainView
                onCreateTopic={onCreateTopic}
                onEditTopic={onEditTopic}
                activeTab={1}
              />
            </RootModal>
          </FederatedContext.Provider>
        </ConfigContext.Provider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

export default MainViewFederated;
