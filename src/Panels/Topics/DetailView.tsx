import React, { FunctionComponent } from 'react';
import { useHistory, useParams } from 'react-router';
import { TopicDetailGroup } from '../../Modules/Topics/TopicDetails/TopicDetailPage';

type topicUseParams = {
  topicName: string;
};

const TopicDetail: FunctionComponent = () => {
  const { topicName } = useParams<topicUseParams>();

  const useUpdateTopic = () => {
    const history = useHistory();
    history.push(`/topics/update/${topicName}`);
  };

  return (
    <TopicDetailGroup topicName={topicName} onUpdateTopic={useUpdateTopic} />
  );
};

export { TopicDetail };

export default TopicDetail;
