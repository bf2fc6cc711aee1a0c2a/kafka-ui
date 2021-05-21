import React, { FunctionComponent, useState } from "react";
import "./style.scss";
import { TopicsListComponent } from "../../Modules/Topics/TopicList/Components/TopicsList";
import { ConfigContext } from "../../Contexts";
import {
  AlertVariant,
  Breadcrumb,
  BreadcrumbItem,
  Title,
  Tabs,
  Level,
  Tab,
  TabTitleText,
  PageSection,
  PageSectionVariants,
  TabContent,
  Dropdown,
  DropdownItem,
  KebabToggle,
  DropdownPosition,
} from "@patternfly/react-core";
import kafkai18n from "../../i18n";
import { I18nextProvider } from "react-i18next";
import { AlertContext, AlertContextProps } from "../../Contexts/Alert";
import { BrowserRouter } from "react-router-dom";
import { FederatedProps } from "../../Utils";
import { ConsumerGroupsList } from "../../Modules/ConsumerGroups/ConsumerGroupList/Components/ConsumerGroupList";

export interface FederatedMainViewProps extends FederatedProps {
  getToken: () => Promise<string>;
  apiBasePath: string;
  activeTab?: number;
  kafkaName?: string;
  kafkaPageLink?: string;
  onCreateTopic: () => void;
  onClickTopic: (topicName: string | undefined) => void;
  getTopicDetailsPath: (topic: string | undefined) => string;
  addAlert: (message: string, variant?: AlertVariant) => void;
  onDeleteConsumer: () => void;
  onDeleteTopic: () => void;
  handleInstanceDrawer?: (isOpen: boolean, activeTab?: string) => void;
  setIsOpenDeleteInstanceModal?: (isOpen: boolean) => void;
}

const FederatedMainView: FunctionComponent<FederatedMainViewProps> = ({
  getToken,
  activeTab = 0,
  apiBasePath,
  kafkaName,
  kafkaPageLink,
  onCreateTopic,
  getTopicDetailsPath,
  onClickTopic,
  addAlert,
  onDeleteConsumer,
  onDeleteTopic,
  onError,
  handleInstanceDrawer,
  setIsOpenDeleteInstanceModal,
}) => {
  const alertContext = {
    addAlert,
  } as AlertContextProps;

  const [activeTabKey, setActiveTabKey] = useState(activeTab);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const contentRefTopics = React.createRef<HTMLElement>();
  const contentRefConsumers = React.createRef<HTMLElement>();

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const onViewInstanceDrawer = (activeTab: string) => {
    handleInstanceDrawer && handleInstanceDrawer(true, activeTab);
  };

  const onOpenDeleteInstanceModal = () => {
    setIsOpenDeleteInstanceModal && setIsOpenDeleteInstanceModal(true);
  };

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect = () => {
    setIsOpen(!isOpen);
  };

  const dropdownItems = [
    <DropdownItem
      key="view-kafka"
      onClick={() => onViewInstanceDrawer("details")}
    >
      View details
    </DropdownItem>,
    <DropdownItem
      key="connect-kafka"
      onClick={() => onViewInstanceDrawer("connection")}
    >
      View connection information
    </DropdownItem>,
    <DropdownItem key="delete-kafka" onClick={onOpenDeleteInstanceModal}>
      Delete instance
    </DropdownItem>,
  ];

  const buildMainView = () => {
    const mainBreadcrumbs = (
      <Breadcrumb>
        <BreadcrumbItem to={kafkaPageLink ? kafkaPageLink : "#"}>
          Kafka Instances
        </BreadcrumbItem>
        <BreadcrumbItem to="#" isActive>
          {kafkaName ? kafkaName : "Kafka Instance Name"}
        </BreadcrumbItem>
      </Breadcrumb>
    );

    return (
      <>
        <section className="pf-c-page__main-breadcrumb">
          {mainBreadcrumbs}
        </section>
        <PageSection variant="light" className="foobarfoobar">
          <Level>
            <Title headingLevel="h1">
              {kafkaName ? kafkaName : "Kafka Instance Name"}
            </Title>
            <Dropdown
              onSelect={onSelect}
              toggle={
                <KebabToggle onToggle={onToggle} id="toggle-data-plane" />
              }
              isOpen={isOpen}
              isPlain
              dropdownItems={dropdownItems}
              position={DropdownPosition.right}
            />
            {/* TODO: Add this back once we get the options available to us for this menu <Button variant='plain' iconPosition='right'>
            <EllipsisVIcon />
          </Button> */}
          </Level>
        </PageSection>

        <PageSection
          variant={PageSectionVariants.light}
          className="pf-c-page__main-tabs"
          isWidthLimited
          padding={{ default: "noPadding" }}
        >
          <Tabs
            activeKey={activeTabKey}
            onSelect={handleTabClick}
            className="pf-m-page-insets"
          >
            <Tab
              title={<TabTitleText>Topics</TabTitleText>}
              eventKey={0}
              id="topics-tab-section"
              aria-label="Topics Tab."
              data-testid="pageKafka-tabTopics"
              tabContentId="kafka-ui-TabcontentTopics"
              tabContentRef={contentRefTopics}
            />
            <Tab
              title={<TabTitleText>Consumer groups</TabTitleText>}
              eventKey={1}
              id="consumer-groups-tab-section"
              aria-label="Consumer Groups Tab."
              data-testid="pageKafka-tabConsumers"
              tabContentId="kafka-ui-TabcontentConsumers"
              tabContentRef={contentRefConsumers}
              className={activeTabKey === 1 ? "kafka-ui--consumer-content" : ""}
            />
          </Tabs>
        </PageSection>
        <PageSection
          variant={PageSectionVariants.default}
          className="page-section-full-height"
        >
          <TabContent
            eventKey={0}
            id="kafka-ui-TabcontentTopics"
            ref={contentRefTopics}
            className="kafka-ui-m-full-height"
            aria-label="Topics."
          >
            <TopicsListComponent
              onCreateTopic={onCreateTopic}
              onClickTopic={onClickTopic}
              getTopicDetailsPath={getTopicDetailsPath}
              onDeleteTopic={onDeleteTopic}
              onError={onError}
            />
          </TabContent>
          <TabContent
            eventKey={1}
            id="kafka-ui-TabcontentConsumers"
            ref={contentRefConsumers}
            className="kafka-ui-m-full-height"
            aria-label="Consumer groups."
            hidden
          >
            <ConsumerGroupsList
              onDeleteConsumerGroup={onDeleteConsumer}
              consumerGroupByTopic={false}
            />
          </TabContent>
        </PageSection>
      </>
    );
  };

  return (
    // TODO don't add BrowserRouter here - see  https://github.com/bf2fc6cc711aee1a0c2a/mk-ui-frontend/issues/74
    <BrowserRouter>
      <I18nextProvider i18n={kafkai18n}>
        <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
          <AlertContext.Provider value={alertContext}>
            {buildMainView()}
          </AlertContext.Provider>
        </ConfigContext.Provider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

export { FederatedMainView };

export default FederatedMainView;
