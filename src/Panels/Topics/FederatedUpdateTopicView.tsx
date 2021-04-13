import React, { FunctionComponent } from 'react';
import './style.scss';
import { UpdateTopicPage } from '../../Modules/Topics/UpdateTopic/UpdateTopicPage';
import { ConfigContext, TopicContextProvider } from '../../Contexts';
import {
  AlertVariant,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import kafkai18n from '../../i18n';
import { I18nextProvider } from 'react-i18next';
import { AlertContext, AlertContextProps } from '../../Contexts/Alert';
import { FederatedProps } from '../../Utils';

export interface FederatedUpdateTopicProps extends FederatedProps {
  getToken: () => Promise<string>;
  apiBasePath: string;
  currentTopic: string;
  getTopicListPath: () => string;
  onClickTopicList: () => void;
  onCancelUpdateTopic: () => void;
  addAlert: (message: string, variant?: AlertVariant) => void;
  onDeleteTopic: () => void;
  onSaveTopic: () => void;
}

const FederatedUpdateTopicView: FunctionComponent<FederatedUpdateTopicProps> = ({
  getToken,
  apiBasePath,
  currentTopic,
  getTopicListPath,
  onClickTopicList,
  onCancelUpdateTopic,
  addAlert,
  onDeleteTopic,
  onSaveTopic,
  onError,
}) => {
  const alertContext = {
    addAlert,
  } as AlertContextProps;
  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
        <AlertContext.Provider value={alertContext}>
          <TopicContextProvider>
            <PageSection variant={PageSectionVariants.light}>
              <UpdateTopicPage
                topicName={currentTopic}
                getTopicListPath={getTopicListPath}
                onClickTopicList={onClickTopicList}
                onCancelUpdateTopic={onCancelUpdateTopic}
                onDeleteTopic={onDeleteTopic}
                onSaveTopic={onSaveTopic}
                onError={onError}
              />
            </PageSection>
          </TopicContextProvider>
        </AlertContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export { FederatedUpdateTopicView };

export default FederatedUpdateTopicView;
