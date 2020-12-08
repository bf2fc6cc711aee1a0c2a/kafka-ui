/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useState } from "react";
import "@patternfly/react-core/dist/styles/base.css";
import {
  AlertGroup,
  AlertActionCloseButton,
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Divider,
  PageSection,
  PageSectionVariants,
  Switch,
  Title,
  Wizard,
} from "@patternfly/react-core";
import { StepTopicName } from "./StepTopicName.patternfly";
import { StepPartitions } from "./StepPartitions.patternfly";
import { StepMessageRetention } from "./StepMessageRetention.patternfly";
import { StepReplicas } from "./StepReplicas.patternfly";
import "./CreateTopicWizard.patternfly.css"

interface ICreateTopicWizard {
  setIsCreateTopic: (value: boolean) => void;
}

export const CreateTopicWizard: React.FC<ICreateTopicWizard> = ({
  setIsCreateTopic,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);
  const [msgRetentionValue, setMsgRetentionValue] = useState("");
  const [topicNameInput, setTopicNameInput] = useState("");
  const [partitionTouchspinValue, setPartitionTouchspinValue] = useState(1);

  const mainBreadcrumbs = (
    <Breadcrumb>
      <BreadcrumbItem to="/openshiftstreams">
        Red Hat OpenShift Streams for Apache Kafka
      </BreadcrumbItem>
      <BreadcrumbItem to="/openshiftstreams">
        MK Cluster Instance
      </BreadcrumbItem>
      <BreadcrumbItem to="#" isActive>
        Create topic
      </BreadcrumbItem>
    </Breadcrumb>
  );

  const handleAlertClose = () => {
    setAlertVisible(true);
  };

  const handleSwitchChange = (isSwitchChecked) => {
    setIsSwitchChecked(isSwitchChecked);
  };

  const closeWizard = () => {
    // setIsCreateTopic(false);
    // setAlertVisible(true);
  };

  const steps = [
    {
      name: "Topic name",
      component: (
        <StepTopicName
          topicNameInput={topicNameInput}
          setTopicNameInput={setTopicNameInput}
        />
      ),
    },
    {
      name: "Partitions",
      component: (
        <StepPartitions
          partitionTouchspinValue={partitionTouchspinValue}
          setPartitionTouchspinValue={setPartitionTouchspinValue}
        />
      ),
    },
    {
      name: "Message retention",
      component: (
        <StepMessageRetention setMsgRetentionValue={setMsgRetentionValue} />
      ),
    },
    {
      name: "Replicas",
      component: <StepReplicas setMsgRetentionValue={setMsgRetentionValue} />,
      nextButtonText: "Finish",
    },
  ];

  const title = "Create topics wizard";

  return (
    <>
      <section className="pf-c-page__main-breadcrumb">
        {mainBreadcrumbs}
      </section>
      <PageSection variant={PageSectionVariants.light}>
        <AlertGroup isToast>
          {alertVisible ? (
            <Alert
              isLiveRegion
              variant="success"
              title="OpenShift Streams topic created"
              actionClose={
                <AlertActionCloseButton
                  aria-label="Close success alert"
                  onClose={handleAlertClose}
                />
              }
            >
              The topic was successfully created in the Kafka instance.
            </Alert>
          ) : (
            <></>
          )}
        </AlertGroup>

        <Title headingLevel="h1" size="lg">
          Create topic
        </Title>
        <Switch
          id="simple-switch"
          label="Show all available options"
          labelOff="Show all available options"
          isChecked={isSwitchChecked}
          onChange={handleSwitchChange}
          className="create-topic-wizard"
        />
      </PageSection>
      <Divider />
      {isSwitchChecked ? (
        <>
          <Divider />
          <PageSection variant={PageSectionVariants.light}>
            {/* <CreateTopicsWizardMoreOptions
              setIsCreateTopic={setIsCreateTopic}
            /> */}
          </PageSection>
        </>
      ) : (
        <PageSection
          variant={PageSectionVariants.light}
          padding={{ default: "noPadding" }}
        >
          <Wizard
            navAriaLabel={`${title} steps`}
            mainAriaLabel={`${title} content`}
            steps={steps}
            onClose={closeWizard}
          />
        </PageSection>
      )}
    </>
  );
};
