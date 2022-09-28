import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import {
  UpdateTopicPage,
  TopicDetailPage,
  DashboardConnected,
  SettingsConnected,
  CreateTopic,
} from '@app/modules/Topics/pages';
import { TopicsConnected } from '@app/modules/Topics';
import { ConsumerGroupsConnected } from '@app/modules/ConsumerGroups';
import { PermissionsConnected } from '@app/modules/Permissions';

const Routes: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' component={DashboardConnected} exact />
        <Route path='/dashboard' component={DashboardConnected} exact />
        <Route path='/topics' component={TopicsConnected} exact />
        <Route
          path='/consumer-groups'
          component={ConsumerGroupsConnected}
          exact
        />
        <Route path='/acls' component={PermissionsConnected} exact />
        <Route path='/settings' component={SettingsConnected} exact />
        <Route path='/topics/:topicName' component={TopicDetailPage} exact />
        <Route path='/topic/create' component={CreateTopic} />
        <Route
          path='/topic/update/:topicName'
          component={UpdateTopicPage}
          exact
        />
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
