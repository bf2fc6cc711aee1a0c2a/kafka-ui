import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertVariant } from "@patternfly/react-core";
import {
  TopicAdvanceConfig,
  IAdvancedTopic,
} from "@app/modules/Topics/components";
import { getTopic, updateTopicModel } from "@app/services";
import { ConfigEntry, TopicSettings } from "@app/openapi/api";
import { AlertContext, ConfigContext } from "@app/contexts";
import { convertUnits } from "@app/modules/Topics/utils";
import { isAxiosError } from "@app/utils/axios";
import "../CreateTopicWizard/CreateTopicWizard.css";

export type UpdateTopicViewProps = {
  topicName: string;
  onCancelUpdateTopic: () => void;
  onDeleteTopic: () => void;
  onSaveTopic: () => void;
  onError?: (errorCode: number, message: string) => void;
};
export const UpdateTopicView: React.FunctionComponent<UpdateTopicViewProps> = ({
  topicName,
  onCancelUpdateTopic,
  onDeleteTopic,
  onSaveTopic,
  onError,
}) => {
  const { t } = useTranslation();
  const initialState = {
    name: topicName,
    numPartitions: "",
    "retention.ms": "",
    "retention.ms.unit": "milliseconds",
    "retention.bytes": "",
    "retention.bytes.unit": "bytes",
    "cleanup.policy": "",
  };
  const [topicData, setTopicData] = useState<IAdvancedTopic>(initialState);
  const config = useContext(ConfigContext);
  const { addAlert } = useContext(AlertContext);

  const fetchTopic = async (topicName) => {
    try {
      const topicRes = await getTopic(topicName, config);
      const configEntries: any = {};
      topicRes.config?.forEach((configItem) => {
        configEntries[configItem.key || ""] = configItem.value || "";
      });

      setTopicData({
        ...topicData,
        numPartitions: topicRes?.partitions?.length.toString() || "",
        "cleanup.policy": configEntries["cleanup.policy"] || "delete",
        "retention.bytes": configEntries["retention.bytes"] || "-1",
        "retention.ms": configEntries["retention.ms"] || "604800000",
      });
    } catch (err) {
      if (isAxiosError(err)) {
        if (onError) {
          onError(err.response?.data.code, err.response?.data.error_message);
        }
        if (err.response?.status === 404) {
          // then it's a non-existent topic
          addAlert(`Topic ${topicName} does not exist`, AlertVariant.danger);
          onCancelUpdateTopic();
        }
      }
    }
  };

  useEffect(() => {
    fetchTopic(topicName);
  }, [topicName]);

  const saveTopic = async () => {
    const { name, ...configEntries } = convertUnits(topicData);

    const newConfig: ConfigEntry[] = [];

    for (const key in configEntries) {
      // TODO Remove check when API supports setting the number of partition
      if (key && key !== "numPartitions") {
        newConfig.push({
          key,
          value: configEntries[key].toString().toLowerCase(),
        });
      }
    }

    const topicSettings: TopicSettings = {
      // TODO Re-enable when the API supports setting the number of partition
      // numPartitions: Number(topicData.numPartitions),
      config: newConfig,
    };

    try {
      const updateStatus = await updateTopicModel(name, topicSettings, config);

      if (updateStatus === 200) {
        addAlert(t("topic.topic_successfully_updated"), AlertVariant.success);
        onSaveTopic();
      }
    } catch (err) {
      if (onError) {
        onError(err.response.data.code, err.response.data.error_message);
      }
      addAlert(err.response.data.error_message, AlertVariant.danger);
    }
  };

  return (
    <>
      <TopicAdvanceConfig
        isCreate={false}
        saveTopic={saveTopic}
        handleCancel={onCancelUpdateTopic}
        topicData={topicData}
        setTopicData={setTopicData}
      />
      <br />
      <br />
    </>
  );
};
