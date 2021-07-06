import React, { FunctionComponent } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { TopicDetailPage } from '@app/modules/Topics/pages/TopicDetail/TopicDetailPage';

type TopicUseParams = {
  topicName: string;
};

type TopicDetailParams = {
  onDeleteTopic: () => void;
};

const ConsumerGroupsByTopicView: FunctionComponent<TopicDetailParams> = () => {
  const { topicName } = useParams<TopicUseParams>();
  const history = useHistory();

  const updateTopic = () => {
    history.push(`/topic/update/${topicName}`);
  };

  return <TopicDetailPage updateTopic={updateTopic} />;
};

export { ConsumerGroupsByTopicView };

export default ConsumerGroupsByTopicView;
