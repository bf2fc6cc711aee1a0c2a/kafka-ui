import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { UpdateTopicPage } from '@app/modules/Topics/pages/UpdateTopic';
import { FederatedContext } from '@app/contexts';
// import "../style.css";

type TopicUseParams = {
  topicName: string;
};

const UpdateTopicConnected: React.FC = () => {
  const history = useHistory();
  const { topicName } = useParams<TopicUseParams>();

  const onSaveTopic = () => {
    history.push(`/topics/${topicName}`);
  };

  const onCancelUpdateTopic = () => {
    history.push(`/topics/${topicName}`);
  };

  const onDeleteTopic = () => {
    history.push('/topics');
  };

  return (
    <FederatedContext.Provider value={{ activeTab: 1, topicName }}>
      <UpdateTopicPage
        onCancelUpdateTopic={onCancelUpdateTopic}
        onDeleteTopic={onDeleteTopic}
        onSaveTopic={onSaveTopic}
      />
    </FederatedContext.Provider>
  );
};

export { UpdateTopicConnected };
