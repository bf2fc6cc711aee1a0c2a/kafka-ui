import React, { FunctionComponent } from "react";
import { I18nextProvider } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { UpdateTopicPage } from "@app/modules/Topics/pages/UpdateTopic";
import {
  FederatedContext,
  FederatedProps,
  ConfigContext,
  IConfiguration,
} from '@app/contexts';
import kafkai18n from '@app/i18n';
import { ModalProvider } from '@app/components/KafkaModal';
import { useBasename } from '@bf2/ui-shared';

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
  const { getBasename } = useBasename();
  const basename = getBasename();

  const onDeleteTopic = () => {
    history.push(`${basename}/${id}`);
  };

  const onSaveTopic = () => {
    history.push(`${basename}/${id}/topics/${topicName}`);
  };

  const onCancelUpdateTopic = () => {
    history.push(`${basename}/${id}/topics/${topicName}`);
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
            onCancelUpdateTopic,
          }}
        >
          <ModalProvider>
            <UpdateTopicPage
              onDeleteTopic={onDeleteTopic}
              onSaveTopic={onSaveTopic}
            />
          </ModalProvider>
        </FederatedContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default UpdateTopicFederated;
