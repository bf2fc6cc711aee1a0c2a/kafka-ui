/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
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
import { mockConsumerGroupDetail } from './ConsumerGroupDetail';
import { ITopicConsumer } from './SearchTopicsConsumerList.patternfly';

export interface ISearchTopicsConsumerListProps {
  isExpanded: (value: boolean) => void;
  consumerGroupDetail: ITopicConsumer[];
}

export const TopicConsumerDetail: React.FunctionComponent<ISearchTopicsConsumerListProps> = ({
  isExpanded,
  consumerGroupDetail,
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

  const rows = mockConsumerGroupDetail.map((consumergroup) => [
    consumergroup.partition,
    consumergroup.id,
    consumergroup.currentOffset,
    consumergroup.logendOffset,
    consumergroup.offsetLag,
    { title: <a href='#'>Reset offset</a> },
  ]);

  const onCloseClick = () => {
    isExpanded(false);
  };

  return (
    <DrawerPanelContent widths={{ default: 'width_50' }}>
      <DrawerHead>
        <span tabIndex={0}>
          <TextContent className='pf-drawer-top'>
            <Text component={TextVariants.small}>Consumer group ID</Text>
            <Text component={TextVariants.h3}>{consumerGroupDetail[0].id}</Text>
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
              <Text component={TextVariants.small}>Active members</Text>
              <Text component={TextVariants.h3}>
                {consumerGroupDetail[0].members}
              </Text>
            </FlexItem>
            <FlexItem>
              <Text component={TextVariants.small}>Unconsumed partitions</Text>
              <Text component={TextVariants.h3}>
                {consumerGroupDetail[0].partitions}
              </Text>
            </FlexItem>
            <FlexItem>
              <Text component={TextVariants.small}>State</Text>
              <Text component={TextVariants.h3}>
                {consumerGroupDetail[0].state}
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
