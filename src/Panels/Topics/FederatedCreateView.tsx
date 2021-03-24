import React, { FunctionComponent } from 'react';
import './style.scss';
import { ConfigContext, IConfiguration } from '../../Contexts';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { CreateTopicPage } from '../../Modules/Topics/CreateTopic/CreateTopicPage';
import kafkai18n from '../../i18n';
import {I18nextProvider} from 'react-i18next';

export type FederatedCreateTopicProps = {
  getToken: () => Promise<string>;
  apiBasePath: string;
  onCloseCreateTopic: () => void;
};

const FederatedCreateTopic: FunctionComponent<FederatedCreateTopicProps> = ({
  getToken,
  apiBasePath,
  onCloseCreateTopic,
}) => {
  const setIsCreateTopic = (b: boolean) => {
    if (!b) {
      onCloseCreateTopic();
    }
  };

  return (
    <I18nextProvider i18n = {kafkai18n}>
    <ConfigContext.Provider
      value={{ basePath: apiBasePath, getToken } as IConfiguration}
    >
      <PageSection variant={PageSectionVariants.light}>
        <CreateTopicPage setIsCreateTopic={setIsCreateTopic} />
      </PageSection>
    </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export { FederatedCreateTopic };

export default FederatedCreateTopic;
