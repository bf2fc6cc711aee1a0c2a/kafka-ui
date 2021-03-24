import React, { FunctionComponent } from 'react';
import './style.scss';
import { UpdateTopicPage } from '../../Modules/Topics/UpdateTopic/UpdateTopicPage';
import { ConfigContext, TopicContextProvider } from '../../Contexts';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import kafkai18n from '../../i18n';
import { I18nextProvider } from 'react-i18next';
export type FederatedUpdateTopicProps = {
  getToken: () => Promise<string>;
  apiBasePath: string;
  currentTopic: string;
};

const FederatedUpdateTopicView: FunctionComponent<FederatedUpdateTopicProps> = ({
  getToken,
  apiBasePath,
  currentTopic,
}) => {
  return (
    <I18nextProvider i18n = {kafkai18n}>
    <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
      <TopicContextProvider>
        <PageSection variant={PageSectionVariants.light}>
          <UpdateTopicPage topicName={currentTopic} />
        </PageSection>
      </TopicContextProvider>
    </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export { FederatedUpdateTopicView };

export default FederatedUpdateTopicView;
