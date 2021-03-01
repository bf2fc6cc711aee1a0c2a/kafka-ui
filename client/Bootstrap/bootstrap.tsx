import { init } from '../i18n';
import ReactDOM from 'react-dom';
import React from 'react';
import { ConfigContext } from '../Contexts';
import { Topics } from '../Panels/Topics';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from '../Panels/Home';
import CreateTopic from '../Panels/Topics/CreateView.patternfly';
import TopicDetail from 'Panels/Topics/DetailView.patternfly';
import UpdateTopicView from '../Panels/Topics/UpdateView.patternfly';
import { TopicContextProvider } from 'Contexts/Topic';
import { ConsumerGroupsView } from '../Panels/ConsumerGroups/ConsumerGroupsView.patternfly';
import { ConsumerGroupsTopicsView } from '../Panels/ConsumerGroupsByTopic/ConsumerGroupsByTopic';

init(); //Bootstrap i18next support
ReactDOM.render(
  <ConfigContext.Provider
    value={{
      basePath: 'http://localhost:8000/api/managed-services-strimzi-ui/v1/api',
      getToken: async () => '',
    }}
  >
    <TopicContextProvider>
      <Router>
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/topics' component={Topics} exact />
          <Route path='/topic/:topicName' component={TopicDetail} exact />
          <Route path='/topics/create' component={CreateTopic} exact />
          <Route
            path='/topics/update/:name'
            component={UpdateTopicView}
            exact
          />
          <Route path='/consumerGroups' component={ConsumerGroupsView} exact />
          <Route
            path='/topics/consumerGroups/:topicName'
            component={ConsumerGroupsTopicsView}
            exact
          />
        </Switch>
      </Router>
    </TopicContextProvider>
  </ConfigContext.Provider>,
  document.getElementById('root')
);
