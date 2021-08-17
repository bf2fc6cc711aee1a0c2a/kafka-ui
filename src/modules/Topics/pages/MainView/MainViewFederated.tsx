import React, { FunctionComponent } from "react";
import {useHistory} from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import {useBasename} from '@bf2/ui-shared';
import {
  FederatedContext,
  FederatedProps,
  ConfigContext,
  IConfiguration,
} from '@app/contexts';
import kafkai18n from '@app/i18n';
import { MainView } from './MainView';
import { ModalProvider } from '@app/components/KafkaModal';

export type MainViewFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

const MainViewFederated: FunctionComponent<MainViewFederatedProps> = ({
  getToken,
  apiBasePath,
  kafkaName,
  kafkaPageLink,
  onError,
  handleInstanceDrawer,
  setIsOpenDeleteInstanceModal,
  showMetrics,
  activeTab = 1,
}) => {

  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
        <FederatedContext.Provider
          value={{
            kafkaName,
            kafkaPageLink,
            onError,
            handleInstanceDrawer,
            setIsOpenDeleteInstanceModal,
            showMetrics,
            activeTab        
          }}
        >
          <ModalProvider>
            <MainView />
          </ModalProvider>
        </FederatedContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default MainViewFederated;
