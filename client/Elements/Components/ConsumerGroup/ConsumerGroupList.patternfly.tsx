/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { useState } from 'react';
import {
  Card,
  Divider,
  Label,
  Pagination,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import { SearchConsumers } from './SearchConsumers.patternfly';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import { useConsumersModel } from '../../../Panels/ConsumerGroups/Model';

export const ConsumerGroupsList: React.FunctionComponent = () => {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [offset, setOffset] = useState(0);

  const { model } = useConsumersModel();

  const onSetPage = (_event, pageNumber: number) => {
    setPage(pageNumber);
    setOffset(page * perPage);
  };

  const onPerPageSelect = (_event, perPage: number) => {
    setPerPage(perPage);
  };

  const tableColumns = [
    { title: 'Consumer Group ID' },
    { title: 'Active Members' },
    { title: 'Unconsumed Partitions' },
    { title: 'State' },
  ];

  const rowData = model.consumersList.items.map((consumer) => [
    consumer?.id,
    consumer?.members,
    consumer?.partitions,
    <Label
      key={consumer?.state}
      color={consumer?.state === 'Stable' ? 'green' : 'red'}
      icon={
        consumer?.state === 'Stable' ? (
          <CheckCircleIcon key={consumer?.state} />
        ) : (
          <ExclamationCircleIcon key={consumer?.state} />
        )
      }
    >
      {consumer?.state}
    </Label>,
  ]);

  return (
    <>
      <Card>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <SearchConsumers />
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
