import React, { FunctionComponent, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider, useTranslation } from "react-i18next";
import { Topics } from "@app/modules/Topics/Topics";
import { ConfigContext } from "@app/contexts";
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
} from "@patternfly/react-core";
import kafkai18n from "@app/i18n";
import { AlertContext, AlertContextProps } from "@app/contexts/Alert";
import { FederatedProps } from "@app/utils";
import { ConsumerGroups } from "@app/modules/ConsumerGroups";
import "./style.scss";

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
}) => {
  const alertContext = {
    addAlert,
  } as AlertContextProps;

  const [activeTabKey, setActiveTabKey] = useState(activeTab);

  const contentRefTopics = React.createRef<HTMLElement>();
  const contentRefConsumers = React.createRef<HTMLElement>();
  const { t } = useTranslation();

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const buildMainView = () => {
    const mainBreadcrumbs = (
      <Breadcrumb>
        <BreadcrumbItem to={kafkaPageLink ? kafkaPageLink : "#"}>
          Kafka Instances
        </BreadcrumbItem>
        <BreadcrumbItem to="#" isActive>
          {kafkaName ? kafkaName : t("common.kafka_instance_name")}
        </BreadcrumbItem>
      </Breadcrumb>
    );

    return (
      <>
        <section className="pf-c-page__main-breadcrumb">
          {mainBreadcrumbs}
        </section>

        <PageSection variant="light">
          <Level>
            <Title headingLevel="h1">
              {kafkaName ? kafkaName : t("common.kafka_instance_name")}
            </Title>
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
        <PageSection variant={PageSectionVariants.default}>
          <TabContent
            eventKey={0}
            id="kafka-ui-TabcontentTopics"
            ref={contentRefTopics}
            className="kafka-ui-m-full-height"
            aria-label="Topics."
          >
            <Topics
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
            <ConsumerGroups
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
