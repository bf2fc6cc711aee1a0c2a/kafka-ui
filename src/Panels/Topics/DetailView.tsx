import React, { FunctionComponent } from 'react';
import { useHistory, useParams } from 'react-router';
import { TopicDetailGroup } from '../../Modules/Topics/TopicDetails/TopicDetailPage';

type TopicUseParams = {
  topicName: string;
};

const TopicDetail: FunctionComponent = () => {
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
      onDeleteTopic={() => {
        history.push('/topics');
        return;
      }}
      eventKey={2}
    />
  );
};

export { TopicDetail };

export default TopicDetail;
