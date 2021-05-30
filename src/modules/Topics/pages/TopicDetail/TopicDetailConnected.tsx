import React from "react";
import { useHistory, useParams } from "react-router";
import { TopicDetailPage } from "@app/modules/Topics/pages/TopicDetail";
import { AlertProvider, FederatedContext } from "@app/contexts";

type TopicUseParams = {
  topicName: string;
};

const TopicDetailConnected: React.FC = () => {
  const history = useHistory();
  const { topicName } = useParams<TopicUseParams>();

  const updateTopic = () => {
    history.push(`/topic/update/${topicName}`);
  };

  const onDeleteTopic = () => {
    history.push("/topics");
  };

  return (
    <AlertProvider>
      <FederatedContext.Provider value={{ topicName, activeTab: 2 }}>
        <TopicDetailPage
          updateTopic={updateTopic}
          onDeleteTopic={onDeleteTopic}
        />
      </FederatedContext.Provider>
    </AlertProvider>
  );
};

export { TopicDetailConnected };
