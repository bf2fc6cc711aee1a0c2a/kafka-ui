import React, { FunctionComponent } from 'react';
import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';
import { UpdateTopicPage } from '../../Modules/Topics/UpdateTopic/UpdateTopicPage';
import { ConfigContext, TopicContextProvider } from '../../Contexts';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';

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
    <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
      <TopicContextProvider>
        <PageSection variant={PageSectionVariants.light}>
          <UpdateTopicPage topicName={currentTopic} />
        </PageSection>
      </TopicContextProvider>
    </ConfigContext.Provider>
  );
};

export { FederatedUpdateTopicView };

export default FederatedUpdateTopicView;
