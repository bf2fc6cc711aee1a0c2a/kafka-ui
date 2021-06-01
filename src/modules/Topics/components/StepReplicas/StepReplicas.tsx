import React from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Stack,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import "../CreateTopicWizard/CreateTopicWizard.css";
import { TextWithLabelPopover } from "@app/components/TextWithLabelPopover";

export type StepReplicasProps = {
  replicationFactor: number;
  minInSyncReplica: number;
};

export const StepReplicas: React.FC<StepReplicasProps> = ({
  replicationFactor,
  minInSyncReplica,
}) => {
  const { t } = useTranslation();

  return (
    <Stack hasGutter className="kafka-ui--wizard-main-body__stack">
      <TextContent>
        <Text component={TextVariants.h2}>{t("common.replicas")}</Text>
        <Text component={TextVariants.p}>{t("topic.replicas_info")}</Text>
        <Text component={TextVariants.small}>{t("topic.replicas_detail")}</Text>
      </TextContent>
      <Alert variant="info" isInline title={t("topic.replicas_helper_text")} />
      <TextWithLabelPopover
        btnAriaLabel={t("common.replicas")}
        fieldLabel={t("common.replicas")}
        fieldValue={replicationFactor.toString()}
        popoverBody={t("topic.replicas_description")}
        popoverHeader={t("topic.replicas")}
      />

      <TextWithLabelPopover
        btnAriaLabel="topic detail min-in-sync replica"
        fieldLabel="Minimum in-sync replicas"
        fieldValue={minInSyncReplica.toString()}
        popoverBody={t("topic.min_insync_replicas_description")}
        popoverHeader={t("topic.min_insync_replicas")}
      />
    </Stack>
  );
};
