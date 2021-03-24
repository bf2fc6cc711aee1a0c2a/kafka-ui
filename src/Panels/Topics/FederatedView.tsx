import React, { FunctionComponent } from 'react';
import './style.scss';
import { TopicsListComponent } from '../../Modules/Topics/TopicList/Components/TopicsList';
import { ConfigContext } from '../../Contexts';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import kafkai18n from '../../i18n';
import {I18nextProvider} from 'react-i18next';

export type FederatedTopicsProps = {
  getToken: () => Promise<string>;
  apiBasePath: string;
  onCreateTopic: () => void;
  onTopicDetails: (topic: string) => void;
};

const FederatedTopics: FunctionComponent<FederatedTopicsProps> = ({
  getToken,
  apiBasePath,
  onCreateTopic,
  onTopicDetails,
}) => {
  return (
    <I18nextProvider i18n = {kafkai18n}>
    <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
      <PageSection variant={PageSectionVariants.light}>
        <TopicsListComponent
          onCreateTopic={onCreateTopic}
          onTopicClick={onTopicDetails}
        />
      </PageSection>
    </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export { FederatedTopics };

export default FederatedTopics;
