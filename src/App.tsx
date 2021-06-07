import React from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter as Router } from "react-router-dom";
import "@patternfly/react-core/dist/styles/base.css";
import kafkai18n from "@app/i18n";
import { ConfigContext } from "@app/contexts";
import {
  ErrorBoundary,
  AppLayout,
  RootModal,
  AlertProvider,
} from "@app/components";
import { Routes } from "@app/Routes";

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider
        value={{
          basePath:
            "http://localhost:8000/api/managed-services-strimzi-ui/v1/api",
          getToken: async () => "",
        }}
      >
        <Router>
          <ErrorBoundary>
            <AlertProvider>
              <RootModal>
                <AppLayout>
                  <Routes />
                </AppLayout>
              </RootModal>
            </AlertProvider>
          </ErrorBoundary>
        </Router>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export { App };
