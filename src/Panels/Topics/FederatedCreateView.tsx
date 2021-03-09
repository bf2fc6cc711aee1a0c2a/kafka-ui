import React, { FunctionComponent } from 'react';
import './style.scss';
import { ConfigContext, IConfiguration } from '../../Contexts';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { CreateTopicPage } from 'src/Modules/Topics/CreateTopic/CreateTopicPage';

export type FederatedCreateTopicProps = {
  getToken: () => Promise<string>;
  apiBasePath: string;
  onCloseCreateTopic: () => void;
};

const FederatedCreateTopic: FunctionComponent<FederatedCreateTopicProps> = ({
  getToken,
  apiBasePath,
  onCloseCreateTopic,
}) => {
  const setIsCreateTopic = (b: boolean) => {
    if (!b) {
      onCloseCreateTopic();
    }
  };

  return (
    <ConfigContext.Provider
      value={{ basePath: apiBasePath, getToken } as IConfiguration}
    >
      <PageSection variant={PageSectionVariants.light}>
        <CreateTopicPage setIsCreateTopic={setIsCreateTopic} />
      </PageSection>
    </ConfigContext.Provider>
  );
};

export { FederatedCreateTopic };

export default FederatedCreateTopic;
