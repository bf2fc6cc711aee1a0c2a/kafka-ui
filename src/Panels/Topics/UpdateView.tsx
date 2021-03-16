import React, { FunctionComponent } from 'react';
import './style.scss';
import {useParams} from 'react-router';
import '@patternfly/react-core/dist/styles/base.css';
import { UpdateTopicPage } from 'src/Modules/Topics/UpdateTopic/UpdateTopicPage';

type TopicUseParams = {
  topicName: string;
};

const UpdateTopic: FunctionComponent<TopicUseParams> = () => {
  const { topicName } = useParams<TopicUseParams>();
  return <UpdateTopicPage topicName={topicName}/>;
};

export { UpdateTopic };

export default UpdateTopic;
