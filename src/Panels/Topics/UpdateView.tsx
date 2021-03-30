import React, { FunctionComponent } from 'react';
import './style.scss';
import { useHistory, useParams } from 'react-router';
import '@patternfly/react-core/dist/styles/base.css';
import { UpdateTopicPage } from 'src/Modules/Topics/UpdateTopic/UpdateTopicPage';

type TopicUseParams = {
  topicName: string;
};

const UpdateTopic: FunctionComponent<TopicUseParams> = () => {
  const { topicName } = useParams<TopicUseParams>();
  const history = useHistory();
  return (
    <UpdateTopicPage
      topicName={topicName}
      getTopicListPath={() => '/topics'}
      onClickTopicList={() => history.push('/topics')}
      onCancelUpdateTopic={() => history.push('/topics')}
      onDeleteTopic={() => {
        return;
      }}
    />
  );
};

export { UpdateTopic };

export default UpdateTopic;
