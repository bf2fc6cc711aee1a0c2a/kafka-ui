import React from "react";
import { useHistory } from "react-router-dom";
import { FederatedContext } from "@app/contexts";
import { MainView } from "./MainView";

const MainViewConnected: React.FC = () => {
  const history = useHistory();

  const onClickCreateTopic = () => {
    history.push("/topic/create");
  };

  const onEditTopic = (topicName: string | undefined) => {
    history.push(`/topic/update/${topicName}`);
  };

  return (
    <FederatedContext.Provider
      value={{ onClickCreateTopic, onEditTopic, activeTab: 2 }}
    >
      <MainView />
    </FederatedContext.Provider>
  );
};

export { MainViewConnected };
