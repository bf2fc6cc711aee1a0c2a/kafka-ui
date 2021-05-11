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

export interface IConsumerGroupDetailProps {
  setIsExpanded: (value: boolean) => void;
  consumerDetail: ConsumerGroup | undefined;
}

export const ConsumerGroupDetail: React.FunctionComponent<IConsumerGroupDetailProps> = ({
  setIsExpanded,
  consumerDetail,
}) => {
  const columns = [
    'Partition',
    'Client ID + Customer ID',
    'Current offset',
    'Log end offset',
    'Offset lag',
    {
      title: '',
      dataLabel: 'Action',
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
            <Text>Consumer group ID</Text>
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
                Active members
              </Text>
              <Text component={TextVariants.h2}>
                {consumerDetail &&
                  consumerDetail.consumers.reduce(function (prev, cur) {
                    return prev + (cur.partition != -1 ? 1 : 0);
                  }, 0)}
              </Text>
            </FlexItem>
            <FlexItem>
              <Text component={TextVariants.h4}>Partitions with lag</Text>
              <Text component={TextVariants.h2}>
                {consumerDetail &&
                  consumerDetail.consumers.reduce(function (prev, cur) {
                    return prev + (cur.lag > 0 ? 1 : 0);
                  }, 0)}
              </Text>
            </FlexItem>
          </Flex>
        </TextContent>
      </DrawerPanelBody>

      <Table
        aria-label='Compact Table'
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
