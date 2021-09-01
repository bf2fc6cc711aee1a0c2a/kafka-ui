import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flex,
  FlexItem,
  TextContent,
  Text,
  TextVariants,
  Stack,
} from '@patternfly/react-core';
import { TableVariant, wrappable, cellWidth } from '@patternfly/react-table';
import { ConsumerGroup } from '@rhoas/kafka-instance-sdk';
import { MASTable } from '@app/components';

export type ConsumerGroupDetailProps = {
  consumerGroupDetail: ConsumerGroup | undefined;
  consumerGroupByTopic: boolean;
};

const ConsumerGroupDetail: React.FunctionComponent<ConsumerGroupDetailProps> =
  ({ consumerGroupDetail, consumerGroupByTopic }) => {
    const { t } = useTranslation();

    const columns = consumerGroupByTopic
      ? [
          {
            title: t('consumerGroup.partition'),
            transforms: [wrappable, cellWidth(20)],
          },
          {
            title: t('consumerGroup.consumer_id'),
            transforms: [wrappable, cellWidth(20)],
          },
          {
            title: t('consumerGroup.current_offset'),
            transforms: [wrappable, cellWidth(20)],
          },
          {
            title: t('consumerGroup.log_end_offset'),
            transforms: [wrappable, cellWidth(20)],
          },
          {
            title: t('consumerGroup.offset_lag'),
            transforms: [wrappable, cellWidth(20)],
          },
          {
            title: '',
            dataLabel: t('common.action'),
          },
        ]
      : [
          { title: t('topic.topic'), transforms: [wrappable, cellWidth(20)] },
          {
            title: t('consumerGroup.partition'),
            transforms: [wrappable, cellWidth(20)],
          },
          {
            title: t('consumerGroup.consumer_id'),
            transforms: [wrappable, cellWidth(20)],
          },
          {
            title: t('consumerGroup.current_offset'),
            transforms: [wrappable, cellWidth(20)],
          },
          {
            title: t('consumerGroup.log_end_offset'),
            transforms: [wrappable, cellWidth(20)],
          },
          {
            title: t('consumerGroup.offset_lag'),
            transforms: [wrappable, cellWidth(20)],
          },
          {
            title: '',
            dataLabel: t('common.action'),
          },
        ];

    const getRows = () => {
      return (
        (consumerGroupDetail &&
          consumerGroupDetail.consumers.map((consumergroup) =>
            consumerGroupByTopic
              ? [
                  consumergroup.partition,
                  {
                    title: consumergroup.memberId ? (
                      consumergroup.groupId + '\n' + consumergroup.memberId
                    ) : (
                      <i>{t('consumerGroup.unassigned')}</i>
                    ),
                  },
                  consumergroup.offset,
                  consumergroup.logEndOffset,
                  consumergroup.lag,
                ]
              : [
                  consumergroup.topic,
                  consumergroup.partition,
                  {
                    title: consumergroup.memberId ? (
                      consumergroup.groupId + '\n' + consumergroup.memberId
                    ) : (
                      <i>{t('consumerGroup.unassigned')}</i>
                    ),
                  },
                  consumergroup.offset,
                  consumergroup.logEndOffset,
                  consumergroup.lag,
                ]
          )) ||
        []
      );
    };

    return (
      <Stack hasGutter>
        <TextContent>
          <Flex>
            <FlexItem>
              <Text component={TextVariants.h4} size={50}>
                {t('consumerGroup.active_members')}
              </Text>
              <Text component={TextVariants.p}>
                <Text component={TextVariants.h2}>
                  {consumerGroupDetail &&
                    consumerGroupDetail.consumers.reduce(function (prev, cur) {
                      return prev + (cur.partition != -1 ? 1 : 0);
                    }, 0)}
                </Text>
              </Text>
            </FlexItem>
            <FlexItem>
              <Text component={TextVariants.h4}>
                {t('consumerGroup.partitions_with_lag')}
              </Text>
              <Text component={TextVariants.p}>
                <Text component={TextVariants.h2}>
                  {consumerGroupDetail &&
                    consumerGroupDetail.consumers.reduce(function (prev, cur) {
                      return prev + (cur.lag > 0 ? 1 : 0);
                    }, 0)}
                </Text>
              </Text>
            </FlexItem>
          </Flex>
        </TextContent>
        <MASTable
          tableProps={{
            cells: columns,
            rows: getRows(),
            'aria-label': t('consumerGroup.consumer_group_info_table_aria'),
            variant: TableVariant.compact,
          }}
        />
      </Stack>
    );
  };

export { ConsumerGroupDetail };
export default ConsumerGroupDetail;
