import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/utilities/Display/display.css';
import '@patternfly/patternfly/utilities/Flex/flex.css';
import '@patternfly/patternfly/utilities/Accessibility/accessibility.css';
import '@patternfly/patternfly/utilities/Sizing/sizing.css';
import '@patternfly/patternfly/utilities/Spacing/spacing.css';
import '@patternfly/patternfly/patternfly.css';
import kafkai18n from '@app/i18n';
import { ConfigContext } from '@app/contexts';
import {
  ErrorBoundary,
  AppLayout,
  ModalProvider,
  AlertProvider,
} from '@app/components';
import { Routes } from '@app/Routes';
import { BasenameContext } from '@bf2/ui-shared';

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={kafkai18n}>
      <BasenameContext.Provider value={{ getBasename: () => "" }}>
        <ConfigContext.Provider
          value={{
            basePath: "http://localhost:8000/data/kafka",
            getToken: async () => "",
          }}
        >
          <Router>
            <ErrorBoundary>
              <AlertProvider>
                <ModalProvider>
                  <AppLayout>
                    <Routes />
                  </AppLayout>
                </ModalProvider>
              </AlertProvider>
            </ErrorBoundary>
          </Router>
        </ConfigContext.Provider>
      </BasenameContext.Provider>
    </I18nextProvider>
  );
};

export { App };
