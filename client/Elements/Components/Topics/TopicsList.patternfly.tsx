/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { useState } from 'react';
import {
  Divider,
  Pagination,
  Button,
  Card,
  Toolbar,
  ToolbarItem,
  ToolbarContent,
} from '@patternfly/react-core';
import { TopicsData } from './TopicsData';

import {
  Table,
  TableVariant,
  TableHeader,
  TableBody,
} from '@patternfly/react-table';
import { SearchTopics } from './SearchTopics.patternfly';
export interface ITopic {
  name: string;
  replicas: number;
  partitions: number;
}
export interface ITopicProps {
  rows: ITopic[];
}

export const TopicsList: React.FunctionComponent = () => {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [, setViewFilteredTable] = useState<boolean>(false);
  const [tableData, setTableData] = useState(TopicsData);
  const [offset, setOffset] = useState(0);

  const onSetPage = (_event, pageNumber: number) => {
    setPage(pageNumber);
    setOffset(page * perPage);
  };

  const onPerPageSelect = (_event, perPage: number) => {
    setPerPage(perPage);
  };

  const tableColumns = [
    { title: 'Name' },
    { title: 'Replicas' },
    { title: 'Partitions' },
  ];

  const rowData = tableData.map((topic) => [
    topic.name,
    topic.replicas,
    topic.partitions,
  ]);

  const actions = [{ title: 'Edit' }, { title: 'Delete' }];
  return (
    <>
      <Card>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <SearchTopics
                viewFilteredTable={setViewFilteredTable}
                tableData={setTableData}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button className='topics-per-page'>Create topic</Button>
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
        <Pagination
          itemCount={rowData.length}
          perPage={perPage}
          page={page}
          onSetPage={onSetPage}
          widgetId='pagination-options-menu-top'
          onPerPageSelect={onPerPageSelect}
          offset={0}
        />
      </Card>
      <Divider />
    </>
  );
};
