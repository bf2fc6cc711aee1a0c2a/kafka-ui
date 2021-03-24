import React, { FunctionComponent } from 'react';
import { TopicDetailGroup } from '../../Modules/Topics/TopicDetails/TopicDetailPage';
import { ConfigContext } from '../../Contexts';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import kafkai18n  from '../../i18n'
import {I18nextProvider} from 'react-i18next'

export type FederatedTopicDetailViewProps = {
  getToken: () => Promise<string>;
  apiBasePath: string;
  currentTopic: string;
  onUpdateTopic: () => void;
};

const FederatedTopicDetailView: FunctionComponent<FederatedTopicDetailViewProps> = ({
  getToken,
  apiBasePath,
  currentTopic,
  onUpdateTopic,
}) => {
  return (
    <I18nextProvider i18n = {kafkai18n}>
    <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
      <PageSection variant={PageSectionVariants.light}>
        <TopicDetailGroup
          topicName={currentTopic}
          onUpdateTopic={onUpdateTopic}
        />
        ;
      </PageSection>
    </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export { FederatedTopicDetailView };

export default FederatedTopicDetailView;
