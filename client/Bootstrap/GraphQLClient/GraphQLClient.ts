/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client';

export type ApolloClientProps = {
  basePath: string;
  middlewares: ApolloLink[];
};

const getApolloClient = ({
  basePath,
  middlewares,
}: ApolloClientProps): ApolloClient<NormalizedCacheObject> => {
  let apiLink: ApolloLink = new HttpLink({
    uri: `${basePath ? basePath : ''}/api`,
    fetch,
  });

  if (middlewares !== undefined) {
    middlewares.forEach(
      (middleware) => (apiLink = concat(middleware, apiLink))
    );
  }

  const configLink = new HttpLink({
    uri: `${basePath ? basePath : ''}/config`,
    fetch,
  });

  const splitLink = split(
    (operation) => operation.getContext().purpose === 'config',
    configLink,
    apiLink
  );

  const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  return apolloClient;
};

const apolloClient = getApolloClient({} as ApolloClientProps);

export { getApolloClient, apolloClient };
