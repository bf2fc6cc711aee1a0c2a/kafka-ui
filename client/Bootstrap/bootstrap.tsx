/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { init } from 'i18n';
import ReactDOM from 'react-dom';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './GraphQLClient';
import {
  ConfigFeatureFlagProvider,
  FeatureFlag,
} from '../Contexts/ConfigFeatureFlag';
import { LoggingProvider } from '../Contexts/Logging';
import { Topics } from '../Panels/Topics';
import { Switch, Route, HashRouter as Router } from 'react-router-dom';
import { Home } from '../Panels/Home';
import { CreateTopicWizard } from 'Elements/Components/CreateTopic/CreateTopicWizard.patternfly';

init(); //Bootstrap i18next support
ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <ConfigFeatureFlagProvider>
      <LoggingProvider>
        <FeatureFlag flag={'client.Pages.PlaceholderHome'}>
          <Router>
            <Switch>
              <Route path='/' component={Home} exact />
              <Route path='/topics' component={Topics} exact />
              <Route
                path='/topics/create'
                component={CreateTopicWizard}
                exact
              />
            </Switch>
          </Router>
        </FeatureFlag>
      </LoggingProvider>
    </ConfigFeatureFlagProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
