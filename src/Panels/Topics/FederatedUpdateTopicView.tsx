import React, { FunctionComponent } from 'react';
import './style.scss';
import { UpdateTopicPage } from '../../Modules/Topics/UpdateTopic/UpdateTopicPage';
import { ConfigContext } from '../../Contexts';
import { AlertVariant } from '@patternfly/react-core';
import kafkai18n from '../../i18n';
import { I18nextProvider } from 'react-i18next';
import { AlertContext, AlertContextProps } from '../../Contexts/Alert';
import { FederatedProps } from '../../Utils';

export interface FederatedUpdateTopicProps extends FederatedProps {
  getToken: () => Promise<string>;
  apiBasePath: string;
  currentTopic: string;
  kafkaName?: string;
  kafkaPageLink?: string;
  kafkaInstanceLink?: string;
  onCancelUpdateTopic: () => void;
  addAlert: (message: string, variant?: AlertVariant) => void;
  onDeleteTopic: () => void;
  onSaveTopic: () => void;
  onDeleteConsumer: () => void;
}

const FederatedUpdateTopicView: FunctionComponent<FederatedUpdateTopicProps> = ({
  getToken,
  apiBasePath,
  currentTopic,
  kafkaName,
  kafkaPageLink,
  kafkaInstanceLink,
  onCancelUpdateTopic,
  addAlert,
  onDeleteTopic,
  onSaveTopic,
  onError,
  onDeleteConsumer,
}) => {
  const alertContext = {
    addAlert,
  } as AlertContextProps;
  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
        <AlertContext.Provider value={alertContext}>
          <UpdateTopicPage
            onDeleteConsumer={onDeleteConsumer}
            topicName={currentTopic}
            onCancelUpdateTopic={onCancelUpdateTopic}
            onDeleteTopic={onDeleteTopic}
            onSaveTopic={onSaveTopic}
            onError={onError}
            kafkaName={kafkaName}
            kafkaPageLink={kafkaPageLink}
            kafkaInstanceLink={kafkaInstanceLink}
          />
        </AlertContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export { FederatedUpdateTopicView };

export default FederatedUpdateTopicView;
