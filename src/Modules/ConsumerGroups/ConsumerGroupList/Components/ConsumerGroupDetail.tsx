import React from 'react';
import {
  DrawerPanelContent,
  DrawerHead,
  DrawerPanelBody,
  DrawerActions,
  DrawerCloseButton,
  Flex,
  FlexItem,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
} from '@patternfly/react-table';
import { ConsumerGroup } from '../../../../OpenApi';
import { useTranslation } from 'react-i18next';

export interface IConsumerGroupDetailProps {
  setIsExpanded: (value: boolean) => void;
  consumerDetail: ConsumerGroup | undefined;
}

export const ConsumerGroupDetail: React.FunctionComponent<IConsumerGroupDetailProps> = ({
  setIsExpanded,
  consumerDetail,
}) => {

  const { t } = useTranslation();

  const columns = [
    t('consumerGroups.partition'),
    `${t('consumerGroups.clientId')} + ${t('consumerGroups.customerId')}`,
    t('consumerGroups.currentOffset'),
    t('consumerGroups.logEndOffset'),
    t('consumerGroups.offsetLag'),
    {
      title: '',
      dataLabel: t('common.action'),
    },
  ];

  const rows =
    consumerDetail &&
    consumerDetail.consumers.map((consumergroup) => [
      consumergroup.partition,
      consumergroup.groupId + consumergroup.memberId,
      consumergroup.offset,
      consumergroup.logEndOffset,
      consumergroup.lag,
    ]);

  const onCloseClick = () => {
    setIsExpanded(false);
  };

  return (
    <DrawerPanelContent widths={{ default: 'width_66' }}>
      <DrawerHead>
        <span>
          <TextContent>
            <Text>{t('consumerGroups.consumerGroupId')}</Text>
            <Text component={TextVariants.h1}>
              {consumerDetail && consumerDetail.groupId}
            </Text>
          </TextContent>
        </span>
        <DrawerActions>
          <DrawerCloseButton onClick={onCloseClick} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody>
        <TextContent>
          <Flex>
            <FlexItem>
              <Text component={TextVariants.h4} size={50}>
              {t('consumerGroups.activeMembers')}
              </Text>
              <Text component={TextVariants.h2}>
                {consumerDetail &&
                  consumerDetail.consumers.reduce(function (prev, cur) {
                    return prev + cur.partition != -1 ? prev + 1 : 0;
                  }, 0)}
              </Text>
            </FlexItem>
            <FlexItem>
              <Text component={TextVariants.h4}>{t('consumerGroups.partitionsWithLag')}</Text>
              <Text component={TextVariants.h2}>
                {consumerDetail &&
                  consumerDetail.consumers.reduce(function (prev, cur) {
                    return prev + cur.lag > 0 ? prev + 1 : 0;
                  }, 0)}
              </Text>
            </FlexItem>
          </Flex>
        </TextContent>
      </DrawerPanelBody>

      <Table
        aria-label={t('consumerGroups.consumerGroupInfoTableAria')}
        variant={TableVariant.compact}
        cells={columns}
        rows={rows}
      >
        <TableHeader />
        <TableBody />
      </Table>
    </DrawerPanelContent>
  );
};
