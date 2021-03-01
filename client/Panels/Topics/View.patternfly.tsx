import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router';
import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';
import { TopicsListComponent } from '../../Modules/Topics/TopicList/Components/TopicsList.patternfly';

const Topics: FunctionComponent = () => {
  const history = useHistory();

  const onCreateTopic = () => {
    history.push('/topics/create');
  };

  return <TopicsListComponent onCreateTopic={onCreateTopic} />;
};

export { Topics };

export default Topics;
