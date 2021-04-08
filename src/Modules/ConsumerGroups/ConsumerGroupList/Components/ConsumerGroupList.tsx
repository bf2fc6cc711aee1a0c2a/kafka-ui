import React, { useContext, useState, useEffect } from 'react';
import {
  Card,
  Divider,
  Pagination,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  AlertVariant,
} from '@patternfly/react-core';
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';

import { EmptySearch } from '../../../Topics/TopicList/Components/EmptySearch';
import { getConsumers } from '../../../../Services/ConsumerServices';
import { ConfigContext } from '../../../../Contexts';
import { ConsumerGroupList } from '../../../../OpenApi';
import { Loading } from '../../../../Components/Loading/Loading';
import { AlertContext } from '../../../../Contexts/Alert';
import { useTimeout } from '../../../../Hooks/useTimeOut';
import { SearchConsumers } from './SearchConsumers';
import { DeleteConsumer } from './DeleteConsumer';

export interface IConsumerGroupsList {
  onDeleteConsumerGroup: () => void;
}

export const ConsumerGroupsList: React.FunctionComponent<IConsumerGroupsList> = ({
  onDeleteConsumerGroup,
}) => {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [offset, setOffset] = useState(0);
  const [consumerGroups, setConsumerGroups] = useState<ConsumerGroupList>();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [consumerGroupName, setConsumerGroupName] = useState<
    string | undefined
  >();
  const [deleteModal, setDeleteModal] = useState(false);

  const config = useContext(ConfigContext);
  const { addAlert } = useContext(AlertContext);

  const fetchConsumers = async () => {
    try {
      const consumerGroupsData = await getConsumers(
        config,
        100,
        offset,
        search
      );
      if (consumerGroupsData) {
        setConsumerGroups(consumerGroupsData);
      }
    } catch (err) {
      addAlert(err.response.data.error, AlertVariant.danger);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchConsumers();
  }, [search, deleteModal]);

  useTimeout(() => fetchConsumers(), 5000);

  if (loading) {
    return <Loading />;
  }

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
    { title: 'Partitions with lag' },
  ];
  const onDelete = (rowId: any) => {
    if (consumerGroups?.items) {
      setConsumerGroupName(consumerGroups.items[rowId].id);
    }
    setDeleteModal(true);
  };

  const actions = [{ title: 'Delete', onClick: (_, rowId) => onDelete(rowId) }];

  const rowData =
    consumerGroups?.items.map((consumer) => [
      consumer.id,
      consumer.consumers?.length,
      consumer.consumers.reduce(function (prev, cur) {
        return prev + cur.lag > 0 ? prev + 1 : 0;
      }, 0),
    ]) || [];

  return (
    <>
      <Card>
        {deleteModal && (
          <DeleteConsumer
            consumerName={consumerGroupName}
            setDeleteModal={setDeleteModal}
            deleteModal={deleteModal}
            onDeleteConsumer={onDeleteConsumerGroup}
          />
        )}
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <SearchConsumers search={search} setSearch={setSearch} />
            </ToolbarItem>
            <ToolbarItem variant='pagination'>
              <Pagination
                itemCount={rowData.length}
                perPage={perPage}
                page={page}
                onSetPage={onSetPage}
                widgetId='consumer-group-pagination-top'
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
        {rowData.length < 1 ? (
          <EmptySearch />
        ) : (
          <Pagination
            itemCount={rowData.length}
            perPage={perPage}
            page={page}
            onSetPage={onSetPage}
            widgetId='consumer-group-pagination-bottom'
            onPerPageSelect={onPerPageSelect}
            offset={0}
          />
        )}
      </Card>
      <Divider />
    </>
  );
};
