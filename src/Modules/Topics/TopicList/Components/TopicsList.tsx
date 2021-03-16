import React, { useContext, useEffect, useState } from 'react';
import {
  AlertVariant,
  Button,
  Card,
  Divider,
  Pagination,
  PaginationVariant,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
  sortable,
} from '@patternfly/react-table';
import { useTimeout } from '../../../../Hooks/useTimeOut';
import { SearchTopics } from './SearchTopics';
import { EmptyTopics } from './EmptyTopics';
import { EmptySearch } from './EmptySearch';
import { getTopics } from '../../../../Services';
import { DeleteTopics } from './DeleteTopicsModal';
import { useHistory } from 'react-router';
import { ConfigContext } from '../../../../Contexts';
import { TopicsList } from '../../../../OpenApi';
import { Loading } from '../../../../Components/Loading/Loading';
import { AlertContext } from '../../../../Contexts/Alert';

import './TopicList.css';

export interface ITopic {
  name: string;
  replicas: number;
  partitions: number;
}

export interface ITopicProps {
  rows: ITopic[];
}

export interface ITopicList {
  onCreateTopic: () => void;
}

export const TopicsListComponent: React.FunctionComponent<ITopicList> = ({
  onCreateTopic,
}) => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [topics, setTopics] = useState<TopicsList>();
  const [filteredTopics, setFilteredTopics] = useState<TopicsList>();
  const [deleteModal, setDeleteModal] = useState(false);
  const [topicName, setTopicName] = useState<string | undefined>();
  const history = useHistory();

  const { addAlert } = useContext(AlertContext);

  const config = useContext(ConfigContext);

  const fetchTopic = async () => {
    try {
      const topicsList = await getTopics(config);
      if (topicsList) {
        setTopics(topicsList);
        setFilteredTopics(topicsList);
      }
    } catch (err) {
      addAlert(err.response.data.err, AlertVariant.danger);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchTopic();
  }, [deleteModal]);

  useTimeout(() => fetchTopic(), 5000);

  const onSetPage = (_event, pageNumber: number) => {
    setPage(pageNumber);
    setOffset(page * perPage);
  };

  const onPerPageSelect = (_event, perPage: number) => {
    setPerPage(perPage);
  };
  const onTopicClick = (topic: string) => {
    history.push(`/topic/${topic}`);
  };

  const tableColumns = [
    { title: 'Name' },
    { title: 'Replicas', transforms: [sortable] },
    { title: 'Partitions', transforms: [sortable] },
  ];
  const rowData =
    filteredTopics?.items?.map((topic) => [
      {
        title: (
          <Button
            variant='link'
            isInline
            onClick={() =>
              onTopicClick((topic && topic.name && topic.name.toString()) || '')
            }
          >
            {topic?.name}
          </Button>
        ),
      },
      topic.partitions
        ?.map((p) => (p.replicas ? p.replicas.length : 0))
        .reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0
        ),
      topic.partitions?.length,
    ]) || [];

  useEffect(() => {
    if (
      search &&
      search.trim() != '' &&
      topics?.items &&
      topics.items.length > 0
    ) {
      const filterSearch = topics?.items.filter(
        (topicsFiltered) =>
          topicsFiltered?.name && topicsFiltered.name.includes(search)
      );
      setFilteredTopics((prevState) =>
        prevState
          ? {
              ...prevState,
              items: filterSearch,
            }
          : undefined
      );
    } else {
      setFilteredTopics(topics);
    }
  }, [search, topics]);

  const onClear = () => {
    setFilteredTopics(topics);
  };
  const onDelete = (rowId: any) => {
    if (filteredTopics?.items) {
      setTopicName(filteredTopics.items[rowId].name);
    }
    setDeleteModal(true);
  };

  const actions = [
    { title: 'Delete', onClick: (_, rowId) => onDelete(rowId) },
    { title: 'Edit' },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {deleteModal && (
        <DeleteTopics
          topicName={topicName}
          setDeleteModal={setDeleteModal}
          deleteModal={deleteModal}
        />
      )}
      {rowData.length < 1 && search.length < 1 ? (
        <EmptyTopics onCreateTopic={onCreateTopic} />
      ) : (
        <Card>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem className='pf-c-toolbar-item--search'>
                <SearchTopics
                  onClear={onClear}
                  search={search}
                  setSearch={setSearch}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  id='topic-list-create-topic-button'
                  className='topics-per-page'
                  onClick={() => {
                    onCreateTopic();
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
                  widgetId='topic-list-pagination-top'
                  onPerPageSelect={onPerPageSelect}
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

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
      )}
      <Divider />
      {rowData.length < 1 && search.length > 1 && <EmptySearch />}
      {rowData.length > 1 && (
        <Card>
          <Pagination
            itemCount={rowData.length}
            perPage={perPage}
            page={page}
            onSetPage={onSetPage}
            widgetId='topic-list-pagination-bottom'
            onPerPageSelect={onPerPageSelect}
            offset={0}
            variant={PaginationVariant.bottom}
          />
        </Card>
      )}
    </>
  );
};
