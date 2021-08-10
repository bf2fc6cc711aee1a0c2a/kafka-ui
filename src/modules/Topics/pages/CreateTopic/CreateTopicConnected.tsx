import React from 'react';
import { useHistory } from 'react-router-dom';
import { CreateTopicPage } from '@app/modules/Topics/pages';

const CreateTopicConnected: React.FC = () => {
  const history = useHistory();

  const onCloseCreateTopic = () => {
    history.push('/topics');
  };

  return <CreateTopicPage onCloseCreateTopic={onCloseCreateTopic} />;
};

export { CreateTopicConnected };
