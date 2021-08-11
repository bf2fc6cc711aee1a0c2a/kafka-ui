import React, { FunctionComponent } from "react";
import { I18nextProvider } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { TopicDetailPage } from "@app/modules/Topics/pages/TopicDetail";
import {
  FederatedContext,
  FederatedProps,
  ConfigContext,
  IConfiguration,
} from '@app/contexts';
import kafkai18n from '@app/i18n';
import { ModalProvider } from '@app/components/KafkaModal';
import { useBasename } from '@bf2/ui-shared';

export type TopicDetailFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

type TopicUseParams = {
  id: string;
  topicName: string;
};

const TopicDetailFederated: FunctionComponent<TopicDetailFederatedProps> = ({
  getToken,
  apiBasePath,
  kafkaName,
  onError,
  kafkaPageLink,
  kafkaInstanceLink,
}) => {
  const history = useHistory();
  const { id, topicName } = useParams<TopicUseParams>();
  const { getBasename } = useBasename();
  const basename = getBasename();

  const onDeleteTopic = () => {
    //Redirect on topics  viewpage after delete topic successfuly
    history.push(`${basename}/${id}`);
  };

  const updateTopic = (topicName: string | undefined) => {
    history.push(`${basename}/${id}/topic/update/${topicName}`);
  };

  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
        <FederatedContext.Provider
          value={{
            activeTab: 2,
            onError,
            kafkaName,
            kafkaPageLink,
            kafkaInstanceLink,
            topicName,
            updateTopic,
          }}
        >
          <ModalProvider>
            <TopicDetailPage onDeleteTopic={onDeleteTopic} />
          </ModalProvider>
        </FederatedContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default TopicDetailFederated;
