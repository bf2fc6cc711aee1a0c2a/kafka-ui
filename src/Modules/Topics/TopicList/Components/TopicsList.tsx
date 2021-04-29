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
import { ConfigContext } from '../../../../Contexts';
import { TopicsList } from '../../../../OpenApi';
import { Loading } from '../../../../Components/Loading/Loading';
import { AlertContext } from '../../../../Contexts/Alert';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  onClickTopic: (topicName: string | undefined) => void;
  getTopicDetailsPath: (topic: string | undefined) => string;
  onDeleteTopic: () => void;
  onError?: (errorCode: number, message: string) => void;
}

export const TopicsListComponent: React.FunctionComponent<ITopicList> = ({
  onCreateTopic,
  getTopicDetailsPath,
  onClickTopic,
  onDeleteTopic,
  onError,
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

  const { t } = useTranslation();

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
      //TODO: Update the api to allow suppress alerts if the application does not want to show them as well.
      if (onError && err.response.data.code === 401) {
        onError(err.response.data.code, err.response.data.error_message);
      } else {
        addAlert(err.response.data.error_message, AlertVariant.danger);
      }
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

  const tableColumns = [
    { title: t('common.name') },
    { title: t('common.partitions'), transforms: [sortable] },
    { title: t('topic.retention_time'), transforms: [sortable] },
    { title: t('topic.retention_size'), transforms: [sortable] },
  ];
  const convertRetentionTime = (milliseconds: number) => {
    let convertedValue;
    if (milliseconds === -1) {
      return 'Unlimited';
    } else if (milliseconds < 60000) {
      if (milliseconds === 1) return milliseconds + ' ' + 'millisecond';
      else return milliseconds + ' ' + 'milliseconds';
    } else if (milliseconds >= 60000 && milliseconds < 3.6e6) {
      convertedValue = milliseconds / 60000;
      convertedValue = Math.round(convertedValue * 100) / 100;
      if (convertedValue === 1) return convertedValue + ' ' + 'minute';
      else return convertedValue + ' ' + 'minutes';
    } else if (milliseconds >= 3.6e6 && milliseconds < 1.728e8) {
      convertedValue = milliseconds / 3.6e6;
      convertedValue = Math.round(convertedValue * 100) / 100;
      if (convertedValue === 1) return convertedValue + ' ' + 'hour';
      else return convertedValue + ' ' + 'hours';
    } else if (milliseconds >= 1.728e8) {
      convertedValue = milliseconds / 8.64e7;
      convertedValue = Math.round(convertedValue * 100) / 100;
      return convertedValue + ' ' + 'days';
    }
  };

  const convertRetentionSize = (byte: number) => {
    let convertedByteValue;
    if (byte === -1) {
      return 'Unlimited';
    } else if (Math.abs(byte) < 1000) {
      if (byte === 1) return byte + ' ' + 'byte';
      else return byte + ' ' + 'bytes';
    } else if (Math.abs(byte) >= 1000 && Math.abs(byte) < 1000000) {
      convertedByteValue = byte / 1000;
      if (convertedByteValue === 1)
        return convertedByteValue + ' ' + 'kilobyte';
      else return convertedByteValue + ' ' + 'kilobytes';
    } else if (Math.abs(byte) >= 1000000 && Math.abs(byte) < 1000000000) {
      convertedByteValue = byte / 1000000;
      if (convertedByteValue === 1)
        return convertedByteValue + ' ' + 'megabyte';
      else return convertedByteValue + ' ' + 'megabytes';
    } else if (Math.abs(byte) >= 1000000000 && Math.abs(byte) < 1000000000000) {
      convertedByteValue = byte / 1000000000;
      if (convertedByteValue === 1)
        return convertedByteValue + ' ' + 'gigabyte';
      else return convertedByteValue + ' ' + 'gigabytes';
    } else if (Math.abs(byte) >= 1000000000000) {
      convertedByteValue = byte / 1000000000000;
      if (convertedByteValue === 1)
        return convertedByteValue + ' ' + 'terabyte';
      else return convertedByteValue + ' ' + 'terabytes';
    }
  };
  const rowData =
    filteredTopics?.items?.map((topic) => [
      {
        title: (
          <Link
            data-testid='tableTopics-linkTopic'
            to={getTopicDetailsPath(topic.name)}
            onClick={(e) => {
              e.preventDefault();
              onClickTopic(topic.name);
            }}
          >
            {topic?.name}
          </Link>
        ),
      },
      topic.partitions?.length,

      convertRetentionTime(
        Number(
          topic.config?.filter((element) => element.key === 'retention.ms')[0]
            ?.value || 0
        )
      ),

      convertRetentionSize(
        Number(
          topic.config?.filter(
            (element) => element.key === 'retention.bytes'
          )[0]?.value || 0
        )
      ),
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

  const onEdit = (rowId: any) => {
    if (filteredTopics?.items) {
      onClickTopic(filteredTopics.items[rowId].name);
    }
  };

  const actions = [
    {
      title: t('common.delete'),
      ['data-testid']: 'tableTopics-actionDelete',
      onClick: (_, rowId) => onDelete(rowId),
    },
    {
      title: t('common.edit'),
      ['data-testid']: 'tableTopics-actionEdit',
      onClick: (_, rowId) => onEdit(rowId),
    },
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
          onDeleteTopic={onDeleteTopic}
        />
      )}
      <Card className='kafka-ui-m-full-height'>
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
                  data-testid='tabTopics-actionCreate'
                  onClick={() => {
                    onCreateTopic();
                  }}
                >
                  {t('topic.create_topic')}
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
            aria-label={t('topic.topic_list_table')}
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
        )}
      </Card>
    </>
  );
};
