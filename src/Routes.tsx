import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import {
  Topics,
  CreateTopic,
  TopicDetail,
  ConsumerGroupsView,
  ConsumerGroupsByTopicView,
  UpdateTopic,
} from "@app/panels";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Topics} exact />
        <Route path="/topics" component={Topics} exact />
        <Route path="/topic/:topicName" component={TopicDetail} exact />
        <Route path="/topics/create" component={CreateTopic} exact />
        <Route path="/topics/update/:topicName" component={UpdateTopic} exact />
        <Route path="/consumerGroups" component={ConsumerGroupsView} exact />
        <Route
          path="/topics/consumerGroups/:topicName"
          component={ConsumerGroupsByTopicView}
          exact
        />
      </Switch>
    </Router>
  );
};

export { Routes };
