import React, { FunctionComponent } from "react";
import { useHistory, useParams } from "react-router";
import { UpdateTopicPage } from "@app/modules/Topics/UpdateTopicPage";
import "./style.scss";

type TopicUseParams = {
  topicName: string;
};

const UpdateTopicView: FunctionComponent<TopicUseParams> = () => {
  const { topicName } = useParams<TopicUseParams>();
  const history = useHistory();
  const onDeleteConsumer = () => {
    history.push("/consumerGroups");
  };
  return (
    <UpdateTopicPage
      onDeleteConsumer={onDeleteConsumer}
      topicName={topicName}
      onCancelUpdateTopic={() => history.push("/topics")}
      onDeleteTopic={() => {
        history.push("/topics");
        return;
      }}
      onSaveTopic={() => {
        history.push("/topics");
        return;
      }}
      activeTab={1}
    />
  );
};

export { UpdateTopicView };

export default UpdateTopicView;
