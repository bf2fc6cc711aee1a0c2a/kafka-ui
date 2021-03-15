import React, { FunctionComponent } from 'react';
import { TopicDetailGroup } from '../../Modules/Topics/TopicDetails/TopicDetailPage';
import { ConfigContext } from '../../Contexts';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';

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
    <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
      <PageSection variant={PageSectionVariants.light}>
        <TopicDetailGroup
          topicName={currentTopic}
          onUpdateTopic={onUpdateTopic}
        />
        ;
      </PageSection>
    </ConfigContext.Provider>
  );
};

export { FederatedTopicDetailView };

export default FederatedTopicDetailView;
