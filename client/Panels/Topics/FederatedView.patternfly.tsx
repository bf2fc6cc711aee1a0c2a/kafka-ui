/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import './style.scss';
import { TopicsListComponent } from '../../Elements/Components/Topics/TopicsList.patternfly';
import { ConfigContext } from '../../Contexts';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import {Configuration} from "../../OpenApi";

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
    <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
      <PageSection variant={PageSectionVariants.light}>
        <TopicsListComponent onCreateTopic={onCreateTopic} />
      </PageSection>
    </ConfigContext.Provider>
  );
};

export { FederatedTopics };

export default FederatedTopics;
