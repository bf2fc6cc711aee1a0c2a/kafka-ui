import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@patternfly/patternfly/utilities/Display/display.css';
import '@patternfly/patternfly/utilities/Flex/flex.css';
import '@patternfly/patternfly/utilities/Accessibility/accessibility.css';
import '@patternfly/patternfly/utilities/Sizing/sizing.css';
import '@patternfly/patternfly/utilities/Spacing/spacing.css';
import '@patternfly/patternfly/patternfly.css';
import { ConfigContext } from '@app/contexts';
import {
  AppLayout,
  AlertProvider,
  PaginationProvider,
  KafkaModalLoader,
  Loading,
} from '@app/components';
import { Routes } from '@app/Routes';
import { BasenameContext } from '@rhoas/app-services-ui-shared';
import { I18nProvider, ModalProvider } from '@rhoas/app-services-ui-components';

const App: React.FC = () => {
  return (
    <I18nProvider
      lng='en'
      resources={{
        en: {
          common: () =>
            import('@rhoas/app-services-ui-components/locales/en/common.json'),
          'create-kafka-instance': () =>
            import(
              '@rhoas/app-services-ui-components/locales/en/create-kafka-instance.json'
            ),
          kafka: () =>
            import('@rhoas/app-services-ui-components/locales/en/kafka.json'),
          metrics: () =>
            import('@rhoas/app-services-ui-components/locales/en/metrics.json'),
          kafkaTemporaryFixMe: () =>
            import('./kafka-ui-dont-modify-temporay.json'),
        },
      }}
      debug={true}
    >
      <BasenameContext.Provider value={{ getBasename: () => '' }}>
        <ConfigContext.Provider
          value={{
            basePath: 'http://localhost:8000/data/kafka',
            getToken: async () => '',
          }}
        >
          <Router>
            <AlertProvider>
              <ModalProvider>
                <PaginationProvider>
                  <Suspense fallback={<Loading />}>
                    <AppLayout>
                      <Routes />
                      <KafkaModalLoader />
                    </AppLayout>
                  </Suspense>
                </PaginationProvider>
              </ModalProvider>
            </AlertProvider>
          </Router>
        </ConfigContext.Provider>
      </BasenameContext.Provider>
    </I18nProvider>
  );
};

export { App };
