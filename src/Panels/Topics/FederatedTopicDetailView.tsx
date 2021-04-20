import React, { FunctionComponent } from 'react';
import { TopicDetailGroup } from '../../Modules/Topics/TopicDetails/TopicDetailPage';
import { ConfigContext } from '../../Contexts';
import { AlertVariant } from '@patternfly/react-core';
import kafkai18n from '../../i18n';
import { I18nextProvider } from 'react-i18next';
import { AlertContext, AlertContextProps } from '../../Contexts/Alert';
import { FederatedProps } from '../../Utils';

export interface FederatedTopicDetailViewProps extends FederatedProps {
  getToken: () => Promise<string>;
  apiBasePath: string;
  currentTopic: string;
  onUpdateTopic: () => void;
  onClickTopicList: () => void;
  addAlert: (message: string, variant?: AlertVariant) => void;
  kafkaName?: string;
  kafkaPageLink?: string;
  kafkaInstanceLink?: string;
  onDeleteTopic: () => void;
}

const FederatedTopicDetailView: FunctionComponent<FederatedTopicDetailViewProps> = ({
  getToken,
  apiBasePath,
  currentTopic,
  kafkaName,
  kafkaPageLink,
  kafkaInstanceLink,
  onUpdateTopic,
  onClickTopicList,
  onDeleteTopic,
  onError,
  addAlert,
}) => {
  const alertContext = {
    addAlert,
  } as AlertContextProps;
  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
        <AlertContext.Provider value={alertContext}>
          <TopicDetailGroup
            eventKey={2}
            topicName={currentTopic}
            onUpdateTopic={onUpdateTopic}
            onClickTopicList={onClickTopicList}
            onDeleteTopic={onDeleteTopic}
            onError={onError}
            kafkaName={kafkaName}
            kafkaPageLink={kafkaPageLink}
            kafkaInstanceLink={kafkaInstanceLink}
          />
          ;
        </AlertContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export { FederatedTopicDetailView };

export default FederatedTopicDetailView;
