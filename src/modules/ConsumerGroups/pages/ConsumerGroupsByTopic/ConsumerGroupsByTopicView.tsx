import React, { FunctionComponent } from "react";
import { TopicDetailPage } from "@app/modules/Topics/pages/TopicDetail/TopicDetailPage";

type TopicDetailParams = {
  onDeleteTopic: () => void;
};

const ConsumerGroupsByTopicView: FunctionComponent<TopicDetailParams> = () => {
  return <TopicDetailPage />;
};

export { ConsumerGroupsByTopicView };

export default ConsumerGroupsByTopicView;
