import React, { FunctionComponent } from 'react';
import './style.scss';
import { TopicsListComponent } from '../../Modules/Topics/TopicList/Components/TopicsList';
import { ConfigContext } from '../../Contexts';
import {
  AlertVariant,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import kafkai18n from '../../i18n';
import { I18nextProvider } from 'react-i18next';
import { AlertContext, AlertContextProps } from '../../Contexts/Alert';
import { BrowserRouter } from 'react-router-dom';

export type FederatedTopicsProps = {
  getToken: () => Promise<string>;
  apiBasePath: string;
  onCreateTopic: () => void;
  onClickTopic: (topicName: string | undefined) => void;
  getTopicDetailsPath: (topic: string | undefined) => string;
  addAlert: (message: string, variant?: AlertVariant) => void;
  onDeleteTopic: () => void;
};

const FederatedTopics: FunctionComponent<FederatedTopicsProps> = ({
  getToken,
  apiBasePath,
  onCreateTopic,
  getTopicDetailsPath,
  onClickTopic,
  addAlert,
  onDeleteTopic,
}) => {
  const alertContext = {
    addAlert,
  } as AlertContextProps;

  return (
    // TODO don't add BrowserRouter here - see  https://github.com/bf2fc6cc711aee1a0c2a/mk-ui-frontend/issues/74
    <BrowserRouter>
      <I18nextProvider i18n={kafkai18n}>
        <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
          <AlertContext.Provider value={alertContext}>
            <PageSection variant={PageSectionVariants.light}>
              <TopicsListComponent
                onCreateTopic={onCreateTopic}
                onClickTopic={onClickTopic}
                getTopicDetailsPath={getTopicDetailsPath}
                onDeleteTopic={onDeleteTopic}
              />
            </PageSection>
          </AlertContext.Provider>
        </ConfigContext.Provider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

export { FederatedTopics };

export default FederatedTopics;
