import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import {
  MainView,
  CreateTopicPage,
  UpdateTopicPage,
  TopicDetailPage,
} from '@app/modules/Topics/pages';
import { ConsumerGroupsView } from '@app/modules/ConsumerGroups/pages';

const Routes: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' component={MainView} exact />
        <Route path='/topics' component={MainView} exact />
        <Route path='/topics/:topicName' component={TopicDetailPage} exact />
        <Route path='/topic/create' component={CreateTopicPage} />
        <Route
          path='/topic/update/:topicName'
          component={UpdateTopicPage}
          exact
        />
        <Route path='/consumerGroups' component={ConsumerGroupsView} exact />
        <Route
          path='/topics/consumerGroups/:topicName'
          component={TopicDetailPage}
          exact
        />
      </Switch>
    </Router>
  );
};

export { Routes };
