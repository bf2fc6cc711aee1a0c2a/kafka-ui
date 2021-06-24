import React, { FunctionComponent } from "react";
import { I18nextProvider } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { UpdateTopicPage } from "@app/modules/Topics/pages/UpdateTopic";
import {
  FederatedContext,
  FederatedProps,
  ConfigContext,
  IConfiguration,
} from "@app/contexts";
import kafkai18n from "@app/i18n";
import { RootModal } from "@app/components/RootModal";

export type UpdateTopicFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

type TopicUseParams = {
  id: string;
  topicName: string;
};

const UpdateTopicFederated: FunctionComponent<UpdateTopicFederatedProps> = ({
  getToken,
  apiBasePath,
  kafkaName,
  kafkaPageLink,
  kafkaInstanceLink,
  onError,
}) => {
  const history = useHistory();
  const { id, topicName } = useParams<TopicUseParams>();

  const onDeleteTopic = () => {
    history.push(`${id}`);
  };

  const onSaveTopic = () => {
    history.push(`${id}/topics/${topicName}`);
  };

  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
        <FederatedContext.Provider
          value={{
            activeTab: 1,
            topicName,
            kafkaName,
            kafkaPageLink,
            kafkaInstanceLink,
            onError,
          }}
        >
          <RootModal>
            <UpdateTopicPage
              onDeleteTopic={onDeleteTopic}
              onSaveTopic={onSaveTopic}
            />
          </RootModal>
        </FederatedContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default UpdateTopicFederated;
