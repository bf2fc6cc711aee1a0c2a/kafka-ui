/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import './style.scss';
import { TopicsList } from '../../Elements/Components/Topics/TopicsList.patternfly';
import { ApiContext } from '../../Contexts';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';

export type FederatedTopicsProps = {
  getToken: () => Promise<string>;
  apiBasePath: string;
  onCreateTopic: () => void;
};

const FederatedTopics: FunctionComponent<FederatedTopicsProps> = ({
  getToken,
  apiBasePath,
  onCreateTopic,
}) => {

  return (
    <ApiContext.Provider value={{ basePath: apiBasePath, getToken: getToken }}>
      <PageSection variant={PageSectionVariants.light}>
        <TopicsList onCreateTopic={onCreateTopic} />
      </PageSection>
    </ApiContext.Provider>
  );
};

export { FederatedTopics };

export default FederatedTopics;
