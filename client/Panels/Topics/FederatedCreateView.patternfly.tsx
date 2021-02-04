/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import './style.scss';
import { LoggingProvider } from '../../Contexts/Logging';
import {
  ConfigFeatureFlagProvider,
  FeatureFlag,
} from '../../Contexts/ConfigFeatureFlag';
import { ApolloProvider } from '@apollo/client';
import { getApolloClient } from '../../Bootstrap/GraphQLClient/GraphQLClient';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { setContext } from '@apollo/client/link/context';
import { CreateTopicWizard } from '../../Elements/Components/CreateTopic/CreateTopicWizard.patternfly';

export type FederatedCreateTopicProps = {
  getApiOpenshiftComToken: () => Promise<string>;
  getToken: () => Promise<string>;
  id: string;
  apiBasePath: string;
  onCloseCreateTopic: () => void;
};

const FederatedCreateTopic: FunctionComponent<FederatedCreateTopicProps> = ({
  id,
  getApiOpenshiftComToken,
  getToken,
  apiBasePath,
  onCloseCreateTopic,
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

  const setIsCreateTopic = (b: boolean) => {
    if (!b) {
      onCloseCreateTopic();
    }
  };

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
              <CreateTopicWizard setIsCreateTopic={setIsCreateTopic} />
            </PageSection>
          </FeatureFlag>
        </LoggingProvider>
      </ConfigFeatureFlagProvider>
    </ApolloProvider>
  );
};

export { FederatedCreateTopic };

export default FederatedCreateTopic;
