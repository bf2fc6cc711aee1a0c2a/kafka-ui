/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { useState } from 'react';
import {
  Label,
  Card,
  Divider,
  Pagination,
  Toolbar,
  Button,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import { TopicConsumerData } from './TopicConsumerData';
import { TopicConsumerDetail } from './TopicConsumerDetail';
import { SearchTopicsConsumerList } from './SearchTopicsConsumerList.patternfly';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import { EmptySearch } from '../Topics/EmptySearch.patternfly';

export const TopicConsumerList: React.FunctionComponent = () => {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [offset, setOffset] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [consumerGroupDetail, setConsumerGroupDetail] = useState(
    TopicConsumerData
  );
  const [tableData, setTableData] = useState(TopicConsumerData);

  const onSetPage = (_event, pageNumber: number) => {
    setPage(pageNumber);
    setOffset(page * perPage);
  };

  const onPerPageSelect = (_event, perPage: number) => {
    setPerPage(perPage);
  };

  const onClickConsumerGroup = (id, members, partitions, state) => {
    const consumerDetail = [id, members, partitions, state];
    setConsumerGroupDetail(consumerDetail);
    setIsExpanded(true);
    console.log(isExpanded);
  };

  const tableColumns = [
    { title: 'Consumer group ID' },
    { title: 'Active members for this topic' },
    { title: 'Unconsumed partitions for this topic' },
    { title: 'State' },
  ];
  const rowData = tableData.map((topicConsumer) => [
    {
      title: (
        <Button
          variant='link'
          isInline
          onClick={() =>
            onClickConsumerGroup(
              topicConsumer.id,
              topicConsumer.members,
              topicConsumer.partitions,
              topicConsumer.state
            )
          }
        >
          {topicConsumer.id}
        </Button>
      ),
    },
    topicConsumer?.members,
    topicConsumer?.partitions,
    {
      title: (
        <Label
          color={topicConsumer.state === 'Stable' ? 'green' : 'red'}
          icon={
            topicConsumer.state === 'Stable' ? (
              <CheckCircleIcon />
            ) : (
              <ExclamationCircleIcon />
            )
          }
        >
          {topicConsumer.state}
        </Label>
      ),
    },
  ]);

  const actions = [{ title: 'Edit' }, { title: 'Delete' }];
  return (
    <>
      <Card>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <SearchTopicsConsumerList tableData={setTableData} />
            </ToolbarItem>

            <ToolbarItem variant='pagination'>
              <Pagination
                itemCount={rowData.length}
                perPage={perPage}
                page={page}
                onSetPage={onSetPage}
                widgetId='pagination-options-menu-top'
                onPerPageSelect={onPerPageSelect}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Divider />

        <Table
          aria-label='Compact Table'
          variant={TableVariant.compact}
          cells={tableColumns}
          rows={
            page != 1
              ? rowData.slice(offset, offset + perPage)
              : rowData.slice(0, perPage)
          }
          actions={actions}
        >
          <TableHeader />
          <TableBody />
        </Table>
      </Card>
      {rowData.length > 0 ? (
        <Pagination
          itemCount={rowData.length}
          perPage={perPage}
          page={page}
          onSetPage={onSetPage}
          widgetId='pagination-options-menu-top'
          onPerPageSelect={onPerPageSelect}
          offset={0}
        />
      ) : (
        <EmptySearch />
      )}
      {isExpanded === true && (
        <TopicConsumerDetail
          consumerGroupDetail={consumerGroupDetail}
          isExpanded={setIsExpanded}
        />
      )}
    </>
  );
};
