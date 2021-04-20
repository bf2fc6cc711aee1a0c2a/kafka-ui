import React, { FunctionComponent } from 'react';
import { useHistory, useParams } from 'react-router';
import { TopicDetailGroup } from '../../Modules/Topics/TopicDetails/TopicDetailPage';

type TopicUseParams = {
  topicName: string;
};

type TopicDetailParams = {
  onDeleteTopic: () => void;
};

const ConsumerGroupsByTopicView: FunctionComponent<TopicDetailParams> = ({
  onDeleteTopic,
}) => {
  const { topicName } = useParams<TopicUseParams>();
  const history = useHistory();

  const useUpdateTopic = () => {
    history.push(`/topics/update/${topicName}`);
  };

  return (
    <TopicDetailGroup
      topicName={topicName}
      onUpdateTopic={useUpdateTopic}
      onClickTopicList={() => history.push('/topics')}
      onDeleteTopic={onDeleteTopic}
      eventKey={1}
    />
  );
};

export { ConsumerGroupsByTopicView };

export default ConsumerGroupsByTopicView;
