import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  PageSection,
  PageSectionVariants,
  Tab,
  TabContent,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
import {
  TopicDetailHead,
  TopicDetailView,
  IAdvancedTopic,
} from "@app/modules/Topics/components";
import { getTopicDetail } from "@app/services";
import { ConfigContext, AlertContext } from "@app/contexts";
import { ConsumerGroups } from "@app/modules/ConsumerGroups";
import { DeleteTopics } from "@app/modules/Topics/dialogs";
import { isAxiosError } from "@app/utils/axios";
import { useFederated } from "@app/contexts";
import "../style.css";

export type TopicDetailGroupProps = {
  updateTopic: () => void;
  onDeleteTopic?: () => void;
};

export const TopicDetailPage: React.FC<TopicDetailGroupProps> = ({
  updateTopic,
  onDeleteTopic,
}) => {
  const {
    activeTab,
    kafkaName,
    kafkaPageLink,
    kafkaInstanceLink,
    topicName = "",
    onError,
  } = useFederated();

  const [topicDetail, setTopicDetail] = useState<IAdvancedTopic>({
    name: topicName,
    numPartitions: "",
    "retention.ms": "",
    "retention.ms.unit": "milliseconds",
    "retention.bytes": "",
    "retention.bytes.unit": "bytes",
    "cleanup.policy": "",
  });
  const [activeTabKey, setActiveTabKey] = useState(activeTab);
  const config = useContext(ConfigContext);
  const [deleteModal, setDeleteModal] = useState(false);
  const { addAlert } = useContext(AlertContext);
  const { t } = useTranslation();
  const contentRefConsumerGroup = React.createRef<HTMLElement>();
  const contentRefProperties = React.createRef<HTMLElement>();

  const fetchTopicDetail = async (topicName: string) => {
    if (activeTab === 2) {
      try {
        const response = await getTopicDetail(topicName, config);
        setTopicDetail(response);
      } catch (err) {
        if (isAxiosError(err)) {
          if (onError) {
            onError(err.response?.data.code, err.response?.data.error_message);
          }
          if (err.response?.status === 404) {
            // then it's a non-existent topic
            addAlert(
              t("topic.topic_not_found", { name: topicName }),
              AlertVariant.danger
            );
          }
        }
      }
    }
  };

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  // Make the get request
  useEffect(() => {
    fetchTopicDetail(topicName);
  }, [topicName]);

  const deleteTopic = () => {
    setDeleteModal(true);
  };

  return (
    <>
      <TopicDetailHead
        topicName={topicName}
        kafkaName={kafkaName}
        kafkaPageLink={kafkaPageLink}
        kafkaInstanceLink={kafkaInstanceLink}
      />
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: "noPadding" }}
        className="pf-c-page__main-tabs"
      >
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          isBox={false}
          className="pf-m-page-insets"
        >
          <Tab
            eventKey={1}
            data-testid="pageTopic-tabConsumers"
            title={
              <TabTitleText>{t("consumerGroup.consumer_groups")}</TabTitleText>
            }
            tabContentId="kafka-ui-TabcontentConsumerGroupList"
            tabContentRef={contentRefConsumerGroup}
          ></Tab>
          <Tab
            eventKey={2}
            title={<TabTitleText>{t("common.properties")}</TabTitleText>}
            data-testid="pageTopic-tabProperties"
            tabContentId="kafka-ui-TabcontentProperties"
            tabContentRef={contentRefProperties}
          />
        </Tabs>
      </PageSection>
      <PageSection
        variant={
          activeTabKey === 2
            ? PageSectionVariants.light
            : PageSectionVariants.default
        }
      >
        <TabContent
          eventKey={1}
          id="kafka-ui-TabcontentConsumerGroupList"
          ref={contentRefConsumerGroup}
          className="kafka-ui-m-full-height"
          aria-label="Consumer groups."
          hidden
        >
          <ConsumerGroups
            consumerGroupByTopic={true}
            topic={topicName}
            rowDataId="tableTopicConsumers-row"
            detailsDataId="tableTopicConsumers-actionDetails"
          />
        </TabContent>
        <TabContent
          eventKey={2}
          id="kafka-ui-TabcontentProperties"
          ref={contentRefProperties}
          className="kafka-ui-m-full-height"
          aria-label="Topic properties."
        >
          <TopicDetailView
            topic={topicDetail}
            deleteTopic={deleteTopic}
            updateTopic={updateTopic}
          />
        </TabContent>
      </PageSection>
      {deleteModal && (
        <DeleteTopics
          topicName={topicName}
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          onDeleteTopic={onDeleteTopic}
        />
      )}
    </>
  );
};
