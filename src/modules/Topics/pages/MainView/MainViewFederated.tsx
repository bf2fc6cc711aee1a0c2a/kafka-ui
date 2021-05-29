import React, { FunctionComponent } from "react";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import {
  AlertContext,
  AlertContextProps,
  FederatedContext,
  FederatedProps,
} from "@app/contexts";
import kafkai18n from "@app/i18n";
import { MainView } from "./MainView";

export type MainViewFederatedProps = FederatedProps;

const MainViewFederated: FunctionComponent<MainViewFederatedProps> = ({
  getToken,
  activeTab = 0,
  apiBasePath,
  kafkaName,
  kafkaPageLink,
  addAlert,
  onError,
  onConnectToRoute,
  getConnectToRoutePath,
  handleInstanceDrawer,
  setIsOpenDeleteInstanceModal,
  dispatchKafkaAction,
}) => {
  const alertContext = {
    addAlert,
  } as AlertContextProps;

  return (
    // TODO don't add BrowserRouter here - see  https://github.com/bf2fc6cc711aee1a0c2a/mk-ui-frontend/issues/74
    <BrowserRouter>
      <I18nextProvider i18n={kafkai18n}>
        <AlertContext.Provider value={alertContext}>
          <FederatedContext.Provider
            value={{
              getToken,
              apiBasePath,
              activeTab,
              kafkaName,
              kafkaPageLink,
              addAlert,
              onError,
              onConnectToRoute,
              getConnectToRoutePath,
              handleInstanceDrawer,
              setIsOpenDeleteInstanceModal,
              dispatchKafkaAction,
            }}
          >
            <MainView />
          </FederatedContext.Provider>
        </AlertContext.Provider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

export default MainViewFederated;
