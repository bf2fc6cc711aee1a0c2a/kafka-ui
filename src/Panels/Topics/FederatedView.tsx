import React, { FunctionComponent } from 'react';
import './style.scss';
import { TopicsListComponent } from '../../Modules/Topics/TopicList/Components/TopicsList';
import { ConfigContext } from '../../Contexts';
import {AlertVariant, PageSection, PageSectionVariants} from '@patternfly/react-core';
import kafkai18n from '../../i18n';
import {I18nextProvider} from 'react-i18next';
import {AlertContext, AlertContextProps} from "../../Contexts/Alert";

export type FederatedTopicsProps = {
  getToken: () => Promise<string>;
  apiBasePath: string;
  onCreateTopic: () => void;
  onTopicDetails: (topic: string) => void;
  addAlert: (message: string, variant?: AlertVariant) => void;
};

const FederatedTopics: FunctionComponent<FederatedTopicsProps> = ({
  getToken,
  apiBasePath,
  onCreateTopic,
  onTopicDetails,
    addAlert
}) => {

  const alertContext = {
    addAlert
  } as AlertContextProps;

  return (
    <I18nextProvider i18n = {kafkai18n}>
    <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
      <AlertContext.Provider value={alertContext}>
      <PageSection variant={PageSectionVariants.light}>
        <TopicsListComponent
          onCreateTopic={onCreateTopic}
          onTopicClick={onTopicDetails}
        />
      </PageSection>
      </AlertContext.Provider>
    </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export { FederatedTopics };

export default FederatedTopics;
