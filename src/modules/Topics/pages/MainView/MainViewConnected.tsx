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
    history.push("/topic/create");
  };

  return (
    <FederatedContext.Provider
      value={{
        activeTab: 1,
        onConnectToRoute,
        getConnectToRoutePath,
      }}
    >
      <AlertProvider>
        <MainView onCreateTopic={onCreateTopic} />
      </AlertProvider>
    </FederatedContext.Provider>
  );
};

export { MainViewConnected };
