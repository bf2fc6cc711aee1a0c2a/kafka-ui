/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  Breadcrumb,
  BreadcrumbItem,
  Divider,
  PageSection,
  PageSectionVariants,
  Title,
} from "@patternfly/react-core";
import "../CreateTopic/CreateTopicWizard.patternfly.css";
import { TopicAdvanceConfig } from "../CreateTopic//TopicAdvanceConfig.patternfly";
import { useParams } from "react-router";
import { getTopicModel } from "Panels/Topics/Model";
import { TopicList } from "Entities/Entities.generated";
import { Topic } from "OpenApi/api";
import { TopicContext } from "Contexts/Topic";

export const UpdateTopic: React.FC = () => {
  const { store, updateStore } = React.useContext(TopicContext);
  const [topics, setTopics] = useState<TopicList>();
  const [alertVisible, setAlertVisible] = useState(false);
  const { name } = useParams<any>();

  const fetchTopic = async (topicName) => {
    const { model } = await getTopicModel(topicName);
    if (model.data) saveToStore(model.data);
  };

  useEffect(() => {
    fetchTopic(name);
  }, []);

  console.log("topics", store);

  const saveToStore = (topic: Topic) => {
    updateStore("topicName", topic.name || "");
    updateStore("partitions", topic.partitions?.length || "");
    topic.config?.forEach((configItem) => {
      updateStore(configItem.key || "", configItem.value || "");
    });
  };

  const mainBreadcrumbs = (
    <Breadcrumb>
      <BreadcrumbItem to="/#/topics">Topics</BreadcrumbItem>
      <BreadcrumbItem to="#" isActive>
        {name}
      </BreadcrumbItem>
    </Breadcrumb>
  );

  const handleAlertClose = () => {
    setAlertVisible(true);
  };

  const saveTopic = async () => {
    setAlertVisible(true);
  };

  return (
    <>
      <section
        className="pf-c-page__main-breadcrumb"
        style={{ padding: "20px 20px" }}
      >
        {mainBreadcrumbs}
        <br />
        <br />
        <Title headingLevel="h1" size="xl">
          {name}
        </Title>
      </section>
      <PageSection variant={PageSectionVariants.light}>
        <AlertGroup isToast>
          {alertVisible ? (
            <Alert
              isLiveRegion
              variant="success"
              title="OpenShift Streams topic updated"
              actionClose={
                <AlertActionCloseButton
                  aria-label="Close success alert"
                  onClose={handleAlertClose}
                />
              }
            >
              The topic was successfully updated in the Kafka instance.
            </Alert>
          ) : (
            <></>
          )}
        </AlertGroup>
      </PageSection>
      <Divider />
      <>
        <Divider />
        <PageSection variant={PageSectionVariants.light}>
          <TopicAdvanceConfig isCreate={false} saveTopic={saveTopic} />
        </PageSection>
      </>
    </>
  );
};
