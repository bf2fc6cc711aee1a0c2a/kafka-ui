import React from "react";
import { useHistory } from "react-router";
import { MainView } from "./MainView";
import { FederatedContext, AlertProvider } from "@app/contexts";

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
      <AlertProvider>
        <MainView
          onCreateTopic={onCreateTopic}
          onEditTopic={onEditTopic}
          activeTab={1}
        />
      </AlertProvider>
    </FederatedContext.Provider>
  );
};

export { MainViewConnected };
