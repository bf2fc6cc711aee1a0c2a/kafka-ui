import React from "react";
import { useHistory } from "react-router";
import { CreateTopicPage } from "@app/modules/Topics/pages";
import { AlertProvider, FederatedContext } from "@app/contexts";

const CreateTopicConnected: React.FC = () => {
  const history = useHistory();
  const onCloseCreateTopic = () => {
    history.push("/topics");
  };

  return (
    <FederatedContext.Provider value={{}}>
      <AlertProvider>
        <CreateTopicPage onCloseCreateTopic={onCloseCreateTopic} />
      </AlertProvider>
    </FederatedContext.Provider>
  );
};

export { CreateTopicConnected };
