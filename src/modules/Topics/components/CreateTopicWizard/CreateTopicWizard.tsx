import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  Divider,
  PageSection,
  PageSectionTypes,
  PageSectionVariants,
  Wizard,
  WizardStep,
} from "@patternfly/react-core";
import {
  StepTopicName,
  StepPartitions,
  StepMessageRetention,
  StepReplicas,
  TopicAdvanceConfig,
  WizardCustomFooter,
} from "@app/modules/Topics/components";
import { DefaultApi, NewTopicInput } from "@app/openapi/api";
import { convertUnits, formatTopicRequest } from "@app/modules/Topics/utils";
import { ConfigContext } from "@app/contexts";
import { Configuration } from "@app/openapi";
import { getTopic } from "@app/services";
import { useAlert } from "@bf2/ui-shared";
import "./CreateTopicWizard.css";

export type CreateTopicWizardProps = {
  isSwitchChecked: boolean;
  setIsCreateTopic?: (value: boolean) => void;
  onCloseCreateTopic: () => void;
};

export interface IAdvancedTopic {
  /** unique identifier for a topic within the cluster */
  name: string;
  /** ordered list of messages that make up a topic */
  numPartitions: string;
  /** the length of time that messages are retained before they are deleted */
  "retention.ms"?: string;
  /** unit for retention time */
  "retention.ms.unit"?: string;
  /** maximum total size of a partition's log segments before old log segments are deleted */
  "retention.bytes"?: string;
  /** unit for retention bytes */
  "retention.bytes.unit"?: string;
  /** determines whether messages that reach the retention window are deleted or compacted */
  "cleanup.policy"?: string;
}

export const CreateTopicWizard: React.FC<CreateTopicWizardProps> = ({
  isSwitchChecked,
  onCloseCreateTopic,
}) => {
  const config = useContext(ConfigContext);
  const { t } = useTranslation();
  const { addAlert } = useAlert();
  const [msgRetentionValue, setMsgRetentionValue] = useState(1);
  const [retentionSize, setRetentionSize] = useState(1);
  const [partitionTouchspinValue, setPartitionTouchspinValue] = useState(1);
  const [replicationFactorTouchspinValue] = useState(3);
  const [minInSyncReplicaTouchspinValue] = useState(2);
  const [topicNameValidated, setTopicNameValidated] =
    useState<"error" | "default">("default");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invalidText, setInvalidText] = useState<string>("");
  const [topicData, setTopicData] = useState<IAdvancedTopic>({
    name: "",
    numPartitions: "1",
    "retention.ms": "7",
    "retention.ms.unit": "days",
    "retention.bytes": "-1",
    "retention.bytes.unit": "bytes",
    "cleanup.policy": "delete",
  });

  const [currentPeriod, setCurrentPeriod] =
    React.useState<string | number>(604800000);
  const [currentSize, setCurrentSize] = React.useState<string | number>(-1);

  const closeWizard = () => {
    onCloseCreateTopic && onCloseCreateTopic();
  };

  const saveTopic = () => {
    // Object may change based on schema
    setIsLoading(true);
    const topic: NewTopicInput = isSwitchChecked
      ? formatTopicRequest(convertUnits(topicData))
      : {
          name: topicData?.name,
          settings: {
            numPartitions: partitionTouchspinValue,
            config: [
              {
                key: "retention.ms",
                value: msgRetentionValue.toString(),
              },
              { key: "retention.bytes", value: retentionSize.toString() },
            ],
          },
        };

    new DefaultApi(
      new Configuration({
        basePath: config?.basePath,
        accessToken: config?.getToken,
      })
    )
      .createTopic(topic)
      .then((res) => {
        addAlert({
          variant: AlertVariant.success,
          title: t("topic.topic_successfully_created"),
        });
        setIsLoading(false);
        closeWizard();
      })
      .catch((err) => {
        setIsLoading(false);
        addAlert({
          variant: AlertVariant.danger,
          title: err.response.data.error_message,
        });
        closeWizard();
      });
  };

  const fetchTopic = async (topicName, onNext) => {
    try {
      const topicRes = await getTopic(topicName, config);
      if (topicRes) {
        setInvalidText(t("topic.already_exists", { name: topicName }));
        setTopicNameValidated("error");
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response.status == "404") {
        setTopicNameValidated("default");
        setIsLoading(false);
        onNext();
      }
    }
  };

  const steps: WizardStep[] = [
    {
      name: t("topic.topic_name"),
      enableNext:
        topicData?.name.trim() !== "" && topicNameValidated === "default",
      component: (
        <StepTopicName
          topicData={topicData}
          setTopicData={setTopicData}
          topicNameValidated={topicNameValidated}
          setTopicNameValidated={setTopicNameValidated}
          invalidText={invalidText}
          setInvalidText={setInvalidText}
        />
      ),
    },
    {
      name: t("common.partitions"),
      canJumpTo: topicData?.name.trim() !== "",
      component: (
        <StepPartitions
          partitionTouchspinValue={partitionTouchspinValue}
          setPartitionTouchspinValue={setPartitionTouchspinValue}
        />
      ),
    },
    {
      name: t("topic.message_retention"),
      canJumpTo: topicData?.name.trim() !== "",
      component: (
        <StepMessageRetention
          setMsgRetentionValue={setMsgRetentionValue}
          currentPeriod={currentPeriod}
          currentSize={currentSize}
          setCurrentPeriod={setCurrentPeriod}
          setCurrentSize={setCurrentSize}
          setRetentionSize={setRetentionSize}
        />
      ),
    },
    {
      name: t("common.replicas"),
      canJumpTo: topicData?.name.trim() !== "",
      component: (
        <StepReplicas
          replicationFactor={replicationFactorTouchspinValue}
          minInSyncReplica={minInSyncReplicaTouchspinValue}
        />
      ),
      nextButtonText: t("common.finish"),
    },
  ];

  const title = t("topic.wizard_title");

  const onValidate = (onNext) => {
    if (topicData?.name.length < 1) {
      setInvalidText(t('topic.required'));
      setTopicNameValidated('error');
    } else if (topicData?.name === '.' || topicData?.name === '..') {
      setInvalidText(t('topic.invalid_name_with_dot'));
      setTopicNameValidated('error');
    } else {
      setIsLoading(true);
      fetchTopic(topicData?.name, onNext);
    }
  };

  return (
    <>
      {isSwitchChecked ? (
        <>
          <Divider className="kafka-ui--divider--FlexShrink" />
          <PageSection variant={PageSectionVariants.light}>
            <TopicAdvanceConfig
              isCreate={true}
              saveTopic={saveTopic}
              handleCancel={onCloseCreateTopic}
              topicData={topicData}
              setTopicData={setTopicData}
            />
          </PageSection>
        </>
      ) : (
        <PageSection
          variant={PageSectionVariants.light}
          type={PageSectionTypes.wizard}
          isFilled
        >
          <Wizard
            navAriaLabel={`${title} steps`}
            mainAriaLabel={`${title} content`}
            steps={steps}
            onClose={closeWizard}
            onSave={saveTopic}
            data-testid="topicBasicCreate-Wizard"
            footer={
              <WizardCustomFooter
                isLoading={isLoading}
                onValidate={onValidate}
                topicNameValidated={topicNameValidated}
                closeWizard={closeWizard}
              />
            }
          />
        </PageSection>
      )}
    </>
  );
};
