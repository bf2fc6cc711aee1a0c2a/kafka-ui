import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router';
import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';
import { TopicsListComponent } from '../../Modules/Topics/TopicList/Components/TopicsList';
import {TabHeaders} from "../../Modules/OpenShiftStreams/TabHeaders/TabHeaders"
const Topics: FunctionComponent = () => {
  const history = useHistory();

  const onCreateTopic = () => {
    history.push('/topics/create');
  };

  return <TabHeaders eventKey={1}/>;
};

export { Topics };

export default Topics;
