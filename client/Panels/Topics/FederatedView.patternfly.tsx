/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import './style.scss';
import { TopicsListComponent } from '../../Elements/Components/Topics/TopicsList.patternfly';
import { LoggingProvider } from '../../Contexts/Logging';
import {
  ConfigFeatureFlagProvider,
  FeatureFlag,
} from '../../Contexts/ConfigFeatureFlag';
import { ApolloProvider } from '@apollo/client';
import { getApolloClient } from '../../Bootstrap/GraphQLClient/GraphQLClient';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { setContext } from '@apollo/client/link/context';

export type FederatedTopicsProps = {
  getApiOpenshiftComToken: () => Promise<string>;
  getToken: () => Promise<string>;
  id: string;
  apiBasePath: string;
  onCreateTopic: () => void;
};

const FederatedTopics: FunctionComponent<FederatedTopicsProps> = ({
  id,
  getApiOpenshiftComToken,
  getToken,
  apiBasePath,
  onCreateTopic,
}) => {
  const authLink = setContext(async () => {
    return {
      headers: {
        authorization: await getToken(),
        'X-Api-Openshift-Com-Token': await getApiOpenshiftComToken(),
        'X-Kafka-Id': id,
      },
    };
  });

  return (
    <ApolloProvider
      client={getApolloClient({
        middlewares: [authLink],
        basePath: apiBasePath,
      })}
    >
      <ConfigFeatureFlagProvider>
        <LoggingProvider>
          <FeatureFlag flag={'client.Pages.PlaceholderHome'}>
            <PageSection variant={PageSectionVariants.light}>
              <TopicsListComponent onCreateTopic={onCreateTopic} />
            </PageSection>
          </FeatureFlag>
        </LoggingProvider>
      </ConfigFeatureFlagProvider>
    </ApolloProvider>
  );
};

export { FederatedTopics };

export default FederatedTopics;
