import React from "react";
import { useHistory } from "react-router-dom";
import { MainView } from "./MainView";
import { FederatedContext } from "@app/contexts";

const MainViewConnected: React.FC = () => {
  const history = useHistory();

  const getConnectToRoutePath = (routePath: string, key?: string) => {
    if (key) {
      return history.createHref({ pathname: `/${routePath}`, key });
    }
    return history.createHref({ pathname: `/${routePath}` });
  };

  const onConnectToRoute = (routePath: string) => {
    history.push(`/${routePath}`);
  };

  const onCreateTopic = () => {
    onConnectToRoute("topic/create");
  };

  const onEditTopic = (topicName: string | undefined) => {
    onConnectToRoute(`topic/update/${topicName}`);
  };

  return (
    <FederatedContext.Provider
      value={{
        onConnectToRoute,
        getConnectToRoutePath,
      }}
    >
      <MainView
        onCreateTopic={onCreateTopic}
        onEditTopic={onEditTopic}
        activeTab={1}
      />
    </FederatedContext.Provider>
  );
};

export { MainViewConnected };
