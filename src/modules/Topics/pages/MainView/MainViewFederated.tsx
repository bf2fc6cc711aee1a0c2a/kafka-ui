import React, { FunctionComponent } from 'react';
import { I18nextProvider } from 'react-i18next';
import {
  FederatedContext,
  FederatedProps,
  ConfigContext,
  IConfiguration,
} from '@app/contexts';
import kafkai18n from '@app/i18n';
import { MainView } from './MainView';
import { KafkaModalLoader, PaginationProvider } from '@app/components';
import { ModalProvider } from '@rhoas/app-services-ui-components';
import {
  useModal,
  ModalType,
  DeleteInstanceProps,
} from '@rhoas/app-services-ui-shared';

export type MainViewFederatedProps = FederatedProps &
  IConfiguration &
  Pick<DeleteInstanceProps, 'kafka'> & {
    apiBasePath: string;
    redirectAfterDeleteInstance?: () => void;
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
  kafka,
  redirectAfterDeleteInstance,
}) => {
  const { showModal } = useModal<ModalType.KasDeleteInstance>();

  const onDeleteInstance = () => {
    showModal &&
      showModal(ModalType.KasDeleteInstance, {
        kafka,
        onDelete: redirectAfterDeleteInstance,
      });
  };

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
            activeTab,
            kafka,
          }}
        >
          <ModalProvider>
            <PaginationProvider>
              <MainView onDeleteInstance={onDeleteInstance} />
              <KafkaModalLoader />
            </PaginationProvider>
          </ModalProvider>
        </FederatedContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export default MainViewFederated;
