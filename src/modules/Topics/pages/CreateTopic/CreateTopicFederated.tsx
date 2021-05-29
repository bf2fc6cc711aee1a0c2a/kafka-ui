import React, { FunctionComponent } from "react";
import { I18nextProvider } from "react-i18next";
import { ConfigContext, IConfiguration } from "@app/contexts";
import { CreateTopicPage } from "@app/modules/Topics/pages/CreateTopic/CreateTopicPage";
import kafkai18n from "@app/i18n";
import {
  AlertContext,
  AlertContextProps,
  FederatedContext,
  FederatedProps,
} from "@app/contexts";

export type CreateTopicFederatedProps = FederatedProps;

const CreateTopicFederated: FunctionComponent<CreateTopicFederatedProps> = ({
  getToken,
  apiBasePath,
  kafkaName,
  kafkaPageLink,
  kafkaInstanceLink,
  addAlert,
  dispatchKafkaAction,
}) => {
  const alertContext = {
    addAlert,
  } as AlertContextProps;

  const onCloseCreateTopic = () => {
    dispatchKafkaAction && dispatchKafkaAction("main-view");
  };

  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider
        value={{ basePath: apiBasePath, getToken } as IConfiguration}
      >
        <AlertContext.Provider value={alertContext}>
          <FederatedContext.Provider
            value={{
              kafkaName,
              kafkaPageLink,
              kafkaInstanceLink,
              dispatchKafkaAction,
            }}
          >
            <CreateTopicPage onCloseCreateTopic={onCloseCreateTopic} />
          </FederatedContext.Provider>
        </AlertContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default CreateTopicFederated;
