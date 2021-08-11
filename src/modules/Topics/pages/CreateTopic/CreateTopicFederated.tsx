import React, { FunctionComponent } from "react";
import { useHistory, useParams } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { CreateTopicPage } from "@app/modules/Topics/pages/CreateTopic/CreateTopicPage";
import kafkai18n from "@app/i18n";
import {
  FederatedContext,
  FederatedProps,
  ConfigContext,
  IConfiguration,
} from "@app/contexts";
import { useBasename } from "@bf2/ui-shared";

export type CreateTopicFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

const CreateTopicFederated: FunctionComponent<CreateTopicFederatedProps> = ({
  getToken,
  apiBasePath,
  kafkaName,
  kafkaPageLink,
  kafkaInstanceLink,
}) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { getBasename } = useBasename();
  const basename = getBasename();

  const onCloseCreateTopic = () => {
    history.push(`${basename}/${id}`);
  };

  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
        <FederatedContext.Provider
          value={{
            kafkaName,
            kafkaPageLink,
            kafkaInstanceLink,
          }}
        >
          <CreateTopicPage onCloseCreateTopic={onCloseCreateTopic} />
        </FederatedContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default CreateTopicFederated;
