import React, { FunctionComponent } from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { TopicDetailPage } from '@app/modules/Topics/pages/TopicDetail';
import {
  FederatedContext,
  FederatedProps,
  ConfigContext,
  IConfiguration,
} from '@app/contexts';
import kafkai18n from '@app/i18n';
import { KafkaActions } from '@app/utils';
import { ModalProvider } from '@app/components/KafkaModal';

export type TopicDetailFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

const TopicDetailFederated: FunctionComponent<TopicDetailFederatedProps> = ({
  getToken,
  apiBasePath,
  kafkaName,
  onError,
  topicName,
  kafkaPageLink,
  kafkaInstanceLink,
  onConnectToRoute,
  getConnectToRoutePath,
  dispatchKafkaAction,
}) => {
  const updateTopic = () => {
    dispatchKafkaAction && dispatchKafkaAction(KafkaActions.UpdateTopic);
  };

  const onDeleteTopic = () => {
    //Redirect on topics  viewpage after delete topic successfuly
    onConnectToRoute && onConnectToRoute('');
    //dispatchKafkaAction && dispatchKafkaAction(KafkaActions.ViewTopics);
  };

  return (
    <BrowserRouter>
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
              onConnectToRoute,
              getConnectToRoutePath,
              dispatchKafkaAction,
            }}
          >
            <ModalProvider>
              <TopicDetailPage
                updateTopic={updateTopic}
                onDeleteTopic={onDeleteTopic}
              />
            </ModalProvider>
          </FederatedContext.Provider>
        </ConfigContext.Provider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

export default TopicDetailFederated;
