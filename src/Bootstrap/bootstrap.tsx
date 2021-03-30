import kafkai18n from '../i18n';
import {I18nextProvider} from 'react-i18next';
import ReactDOM from 'react-dom';
import React from 'react';
import { ConfigContext } from '../Contexts';
import { Topics } from '../Views/Topics';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import CreateTopic from '../Views/Topics/CreateView';
import TopicDetail from '../Views/Topics/DetailView';
import UpdateTopicView from '../Views/Topics/UpdateView';
import { TopicContextProvider } from '../Contexts/Topic';
import { ConsumerGroupsView } from '../Views/ConsumerGroups/ConsumerGroupsView';
import { ConsumerGroupsTopicsView } from '../Views/ConsumerGroupsByTopic/ConsumerGroupsByTopic';
import { ErrorBoundary } from '../Components/ErrorBoundary/ErrorBoundary';
import { AlertProvider } from '../Contexts/Alert/Context';
import { MastHead } from '../Views/MastHead/MastHead';

//Bootstrap i18next support
ReactDOM.render(
  <I18nextProvider i18n = {kafkai18n}>
  <ConfigContext.Provider
    value={{
      basePath: 'http://localhost:8000/api/managed-services-strimzi-ui/v1/api',
      getToken: async () => '',
    }}
  >
    <TopicContextProvider>
      <MastHead>
        <Router>
          <AlertProvider>
            <ErrorBoundary>
              <Switch>
                <Route path='/' component={Topics} exact />
                <Route path='/topics' component={Topics} exact />
                <Route path='/topic/:topicName' component={TopicDetail} exact />
                <Route path='/topics/create' component={CreateTopic} exact />
                <Route
                  path='/topics/update/:topicName'
                  component={UpdateTopicView}
                  exact
                />
                <Route
                  path='/consumerGroups'
                  component={ConsumerGroupsView}
                  exact
                />
                <Route
                  path='/topics/consumerGroups/:topicName'
                  component={ConsumerGroupsTopicsView}
                  exact
                />
              </Switch>
            </ErrorBoundary>
          </AlertProvider>
        </Router>
      </MastHead>
    </TopicContextProvider>
  </ConfigContext.Provider>
  </I18nextProvider>,
  document.getElementById('root')
);
