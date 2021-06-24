import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { TopicDetailPage } from "@app/modules/Topics/pages/TopicDetail";
import { FederatedContext } from "@app/contexts";

type TopicUseParams = {
  topicName: string;
};

const TopicDetailConnected: React.FC = () => {
  const history = useHistory();
  const { topicName } = useParams<TopicUseParams>();

  const onDeleteTopic = () => {
    history.push("/topics");
  };

  return (
    <FederatedContext.Provider value={{ topicName, activeTab: 2 }}>
      <TopicDetailPage onDeleteTopic={onDeleteTopic} />
    </FederatedContext.Provider>
  );
};

export { TopicDetailConnected };
