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
  getTopicListPath: () => string;
  onClickTopicList: () => void;
  addAlert: (message: string, variant?: AlertVariant) => void;

  onDeleteTopic: () => void;
}

const FederatedTopicDetailView: FunctionComponent<FederatedTopicDetailViewProps> = ({
  getToken,
  apiBasePath,
  currentTopic,
  onUpdateTopic,
  getTopicListPath,
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
            getTopicListPath={getTopicListPath}
            onClickTopicList={onClickTopicList}
            onDeleteTopic={onDeleteTopic}
            onError={onError}
          />
          ;
        </AlertContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export { FederatedTopicDetailView };

export default FederatedTopicDetailView;
