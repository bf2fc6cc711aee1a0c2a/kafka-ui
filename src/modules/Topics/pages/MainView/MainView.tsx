import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  PageSection,
  PageSectionVariants,
  Title,
  Tabs,
  Level,
  Tab,
  TabTitleText,
  TabContent,
} from "@patternfly/react-core";
import EllipsisVIcon from "@patternfly/react-icons/dist/js/icons/ellipsis-v-icon";
import { Topics, TopicsProps } from "@app/modules/Topics/Topics";
import { ConsumerGroups } from "@app/modules/ConsumerGroups";
import { useFederated } from "@app/contexts";
import "../style.css";

export type MainViewProps = TopicsProps & {
  activeTab?: number;
};

export const MainView: React.FC<MainViewProps> = ({
  onCreateTopic,
  onEditTopic,
  activeTab,
}) => {
  const { t } = useTranslation();
  const { kafkaPageLink, kafkaName } = useFederated();

  const [activeTabKey, setActiveTabKey] = useState(activeTab);
  const contentRefConsumerGroups = React.createRef<HTMLElement>();
  const contentRefTopics = React.createRef<HTMLElement>();

  const handleTabClick = (_event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const mainBreadcrumbs = (
    <Breadcrumb>
      <BreadcrumbItem to={kafkaPageLink || "#"}>
        {t("common.kafka_instance")}
      </BreadcrumbItem>
      <BreadcrumbItem to="#" isActive>
        {kafkaName || t("common.kafka_instance_name")}
      </BreadcrumbItem>
    </Breadcrumb>
  );

  return (
    <>
      <section className="pf-c-page__main-breadcrumb">
        {mainBreadcrumbs}
      </section>

      <PageSection variant={PageSectionVariants.light}>
        <Level>
          <Title headingLevel="h1">
            {kafkaName ? kafkaName : t("common.kafka_instance_name")}
          </Title>
          <Button variant="plain" iconPosition="right">
            <EllipsisVIcon />
          </Button>
        </Level>
      </PageSection>
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: "noPadding" }}
        className="pf-c-page__main-tabs"
      >
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          data-testid="pageKafka-tabProperties"
          className="pf-m-page-insets"
        >
          <Tab
            title={<TabTitleText>{t("topic.topics")}</TabTitleText>}
            eventKey={1}
            data-testid="pageKafka-tabTopics"
            id="topics-tab-section"
            aria-label={t("topic.topics")}
            tabContentRef={contentRefTopics}
            tabContentId="kafka-ui-TabcontentTopicsList"
            // className="kafka-ui-m-full-height"
          ></Tab>
          <Tab
            title={
              <TabTitleText>{t("consumerGroup.consumer_groups")}</TabTitleText>
            }
            eventKey={2}
            data-testid="pageKafka-tabConsumers"
            id="consumer-groups-tab-section"
            aria-label={t("consumerGroup.consumer_groups")}
            tabContentRef={contentRefConsumerGroups}
            tabContentId="kafka-ui-TabcontentConsumersList"
            // className='kafka-ui-m-full-height'
          ></Tab>
        </Tabs>
      </PageSection>
      <PageSection isFilled>
        <TabContent
          eventKey={1}
          ref={contentRefTopics}
          id="kafka-ui-TabcontentTopicsList"
          className="kafka-ui-m-full-height"
          aria-label={t("topic.topics")}
        >
          <Topics onCreateTopic={onCreateTopic} onEditTopic={onEditTopic} />
        </TabContent>
        <TabContent
          eventKey={2}
          ref={contentRefConsumerGroups}
          id="kafka-ui-TabcontentConsumersList"
          className="kafka-ui-m-full-height"
          aria-label={t("consumerGroup.consumer_groups")}
          hidden
        >
          <ConsumerGroups consumerGroupByTopic={false} />
        </TabContent>
      </PageSection>
    </>
  );
};
