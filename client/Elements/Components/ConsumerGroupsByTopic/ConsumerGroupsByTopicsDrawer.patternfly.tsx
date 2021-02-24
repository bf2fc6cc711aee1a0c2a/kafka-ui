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
import { mockConsumerGroupDetailByTopics } from './ConsumerGroupDetailByTopics';
import { IConsumerGroupByTopic } from './SearchConsumerGroupsByTopics.patternfly';

export interface ISearchTopicsConsumerListProps {
  isExpanded: (value: boolean) => void;
  consumerGroupDetail: IConsumerGroupByTopic | undefined;
}

export const ConsumerGroupsByTopicDrawer: React.FunctionComponent<ISearchTopicsConsumerListProps> = ({
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

  const rows = mockConsumerGroupDetailByTopics.map((consumergroup) => [
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
        <span>
          <TextContent>
            <Text>Consumer group ID</Text>
            <Text component={TextVariants.h1}>
              {consumerGroupDetail && consumerGroupDetail.id}
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
                {consumerGroupDetail && consumerGroupDetail.members}
              </Text>
            </FlexItem>
            <FlexItem>
              <Text component={TextVariants.h4}>Unconsumed partitions</Text>
              <Text component={TextVariants.h2}>
                {consumerGroupDetail && consumerGroupDetail.partitions}
              </Text>
            </FlexItem>
            <FlexItem>
              <Text component={TextVariants.h4}>State</Text>
              <Text component={TextVariants.h2}>
                {consumerGroupDetail && consumerGroupDetail.state}
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
