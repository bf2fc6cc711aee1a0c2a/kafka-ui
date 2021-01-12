/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { useState } from 'react';
import {
  Button,
  Card,
  Divider,
  Pagination,
  Toolbar,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import SpaceShuttleIcon from '@patternfly/react-icons/dist/js/icons/space-shuttle-icon';
import { SearchTopics } from './SearchTopics.patternfly';
import { useTopicsModel } from '../../../Panels/Topics/Model';

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
  const [offset, setOffset] = useState(0);

  const { model } = useTopicsModel();

  const history = useHistory();
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

  const rowData = model.topicList.items.map((topic) => [
    topic?.name,
    topic?.partitions
      ?.map((p) => p.replicas.length)
      .reduce((previousValue, currentValue) => previousValue + currentValue),
    topic?.partitions?.length,
  ]);

  const actions = [{ title: 'Edit' }, { title: 'Delete' }];
  return (
    <>
      <Card>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <SearchTopics />
            </ToolbarItem>
            <ToolbarItem>
              <Button
                className='topics-per-page'
                onClick={() => {
                  history.push('/topics/create');
                }}
              >
                Create topic
              </Button>
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
        {rowData.length > 0 ? (
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
        ) : (
          <EmptyState>
            <EmptyStateIcon icon={SpaceShuttleIcon} />
            <Title headingLevel='h5' size='lg'>
              No Topics
            </Title>
            <EmptyStateBody>
              You don&apos;t currently have any topics. Create a topic by
              clicking the button {<br />}below or create topics using the
              {<Button variant='link'>Openshift console</Button>}
            </EmptyStateBody>
            <Button
              variant='primary'
              className='topics-empty-page'
              onClick={() => {
                history.push('/topics/create');
              }}
            >
              Create Topic
            </Button>
          </EmptyState>
        )}
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
