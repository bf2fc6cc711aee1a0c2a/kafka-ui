import React from "react";
import { useTranslation } from "react-i18next";
import {
  Flex,
  FlexItem,
  TextContent,
  Text,
  TextVariants,
} from "@patternfly/react-core";
import { TableVariant } from "@patternfly/react-table";
import { ConsumerGroup } from "@rhoas/kafka-instance-sdk";
import { MASTable } from "@app/components";

export type ConsumerGroupDetailProps = {
  consumerDetail: ConsumerGroup | undefined;
};

export const ConsumerGroupDetail: React.FunctionComponent<ConsumerGroupDetailProps> = ({
  consumerDetail,
}) => {
  const { t } = useTranslation();

  const columns = [
    t("consumerGroup.partition"),
    `${t("consumerGroup.client_id")} + ${t("consumerGroup.customer_id")}`,
    t("consumerGroup.current_offset"),
    t("consumerGroup.log_end_offset"),
    t("consumerGroup.offset_lag"),
    {
      title: "",
      dataLabel: t("common.action"),
    },
  ];

  const getRows = () => {
    return (
      (consumerDetail &&
        consumerDetail.consumers.map((consumergroup) => [
          consumergroup.partition,
          consumergroup.groupId + consumergroup.memberId,
          consumergroup.offset,
          consumergroup.logEndOffset,
          consumergroup.lag,
        ])) ||
      []
    );
  };

  return (
    <>
      <TextContent>
        <Flex>
          <FlexItem>
            <Text component={TextVariants.h4} size={50}>
              {t("consumerGroup.active_members")}
            </Text>
            <Text component={TextVariants.h2}>
              {consumerDetail &&
                consumerDetail.consumers.reduce(function (prev, cur) {
                  return prev + (cur.partition != -1 ? 1 : 0);
                }, 0)}
            </Text>
          </FlexItem>
          <FlexItem>
            <Text component={TextVariants.h4}>
              {t("consumerGroup.partitions_with_lag")}
            </Text>
            <Text component={TextVariants.h2}>
              {consumerDetail &&
                consumerDetail.consumers.reduce(function (prev, cur) {
                  return prev + (cur.lag > 0 ? 1 : 0);
                }, 0)}
            </Text>
          </FlexItem>
        </Flex>
      </TextContent>
      <MASTable
        tableProps={{
          cells: columns,
          rows: getRows(),
          "aria-label": t("consumerGroup.consumer_group_info_table_aria"),
          variant: TableVariant.compact,
        }}
      />
    </>
  );
};
