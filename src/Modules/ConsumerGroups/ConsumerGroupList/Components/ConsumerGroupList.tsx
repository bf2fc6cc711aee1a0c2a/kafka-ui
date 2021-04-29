import React, { useContext, useState, useEffect } from 'react';
import {
  Divider,
  Pagination,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  AlertVariant,
  Button,
  Drawer,
  DrawerContent,
  PaginationVariant,
} from '@patternfly/react-core';
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';

import { EmptyConsumers } from './EmptyConsumers';
import {
  getConsumerGroups,
  getConsumerGroupDetail,
  getConsumerGroupsByTopic,
} from '../../../../Services/ConsumerGroupsServices';
import { ConfigContext } from '../../../../Contexts';
import { ConsumerGroupList, ConsumerGroup } from '../../../../OpenApi';
import { Loading } from '../../../../Components/Loading/Loading';
import { AlertContext } from '../../../../Contexts/Alert';
import { useTimeout } from '../../../../Hooks/useTimeOut';
import { SearchConsumers } from './SearchConsumers';
import { DeleteConsumerGroup } from './DeleteConsumerGroup';
import { ConsumerGroupDetail } from './ConsumerGroupDetail';
import { useTranslation } from 'react-i18next';
export interface IConsumerGroupsList {
  onDeleteConsumerGroup: () => void;
  consumerGroupByTopic: boolean;
  topic?: string;
  rowDataId?: string;
  detailsDataId?: string;
}

export const ConsumerGroupsList: React.FunctionComponent<IConsumerGroupsList> = ({
  onDeleteConsumerGroup,
  consumerGroupByTopic,
  topic,
  rowDataId,
  detailsDataId,
}) => {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [consumerGroups, setConsumerGroups] = useState<ConsumerGroupList>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [
    consumerGroupDetail,
    setConsumerGroupDetail,
  ] = useState<ConsumerGroup>();
  const [consumerGroupId, setConsumerGroupId] = useState<string | undefined>();
  const [deleteModal, setDeleteModal] = useState(false);
  const [
    filteredConsumerGroups,
    setFilteredConsumerGroups,
  ] = useState<ConsumerGroupList>();

  const config = useContext(ConfigContext);
  const { addAlert } = useContext(AlertContext);

  const { t } = useTranslation();

  const fetchConsumerGroups = async () => {
    if (consumerGroupByTopic && topic) {
      try {
        const consumerGroupsData = await getConsumerGroupsByTopic(
          config,
          100,
          offset,
          topic
        );
        if (consumerGroupsData) {
          setConsumerGroups(consumerGroupsData);
          setFilteredConsumerGroups(consumerGroupsData);
        }
      } catch (err) {
        addAlert(err.response.data.error_message, AlertVariant.danger);
      }
      setLoading(false);
    } else {
      try {
        const consumerGroupsData = await getConsumerGroups(config);
        if (consumerGroupsData) {
          setConsumerGroups(consumerGroupsData);
          setFilteredConsumerGroups(consumerGroupsData);
        }
      } catch (err) {
        addAlert(err.response.data.error_message, AlertVariant.danger);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchConsumerGroups();
  }, [deleteModal]);

  useEffect(() => {
    if (
      search &&
      search.trim() != '' &&
      consumerGroups?.items &&
      consumerGroups.items.length > 0
    ) {
      const filterSearch = consumerGroups?.items.filter(
        (consumerGroupsFiltered) =>
          consumerGroupsFiltered?.groupId &&
          consumerGroupsFiltered.groupId.includes(search)
      );
      setFilteredConsumerGroups((prevState) =>
        prevState
          ? {
              ...prevState,
              items: filterSearch,
            }
          : undefined
      );
    } else {
      setFilteredConsumerGroups(consumerGroups);
    }
  }, [search]);

  useTimeout(() => fetchConsumerGroups(), 5000);

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
    { title: t('consumerGroup.consumer_group_id') },
    { title: t('consumerGroup.active_members') },
    { title: t('consumerGroup.partitions_with_lag') },
  ];
  const onDelete = (rowId: any) => {
    if (filteredConsumerGroups?.items) {
      setConsumerGroupId(filteredConsumerGroups.items[rowId].groupId);
      setDeleteModal(true);
    }
  };

  const actions = [
    {
      title: t('common.delete'),
      ['data-testid']: 'tableConsumers-actionDelete',
      onClick: (_, rowId) => onDelete(rowId),
    },
  ];

  const fetchConsumerGroupDetail = async (consumerGroupId) => {
    try {
      const consumerData = await getConsumerGroupDetail(
        consumerGroupId,
        config
      );
      if (consumerData) {
        setConsumerGroupDetail(consumerData);
      }
    } catch (err) {
      addAlert(err.response.data.error_message, AlertVariant.danger);
    }
    setIsExpanded(true);
  };

  const panelContent = (
    <ConsumerGroupDetail
      setIsExpanded={setIsExpanded}
      consumerDetail={consumerGroupDetail}
    />
  );
  const rowData =
    filteredConsumerGroups?.items.map((consumer) => [
      {
        title: (
          <Button
            variant='link'
            isInline
            onClick={() => fetchConsumerGroupDetail(consumer.groupId)}
            data-testid={
              detailsDataId ? detailsDataId : 'tableConsumers-actionDetails'
            }
          >
            {consumer.groupId}
          </Button>
        ),
        props: { 'data-testid': rowDataId ? rowDataId : 'tableConsumers-row' },
      },

      consumer.consumers.reduce(function (prev, cur) {
        return prev + cur.partition != -1 ? prev + 1 : 0;
      }, 0),
      consumer.consumers.reduce(function (prev, cur) {
        return prev + cur.lag > 0 ? prev + 1 : 0;
      }, 0),
    ]) || [];

  return (
    <>
      {deleteModal && (
        <DeleteConsumerGroup
          consumerName={consumerGroupId}
          setDeleteModal={setDeleteModal}
          deleteModal={deleteModal}
          onDeleteConsumer={onDeleteConsumerGroup}
        />
      )}
      <Drawer isExpanded={isExpanded}>
        <DrawerContent panelContent={panelContent}>
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
          {consumerGroupByTopic ? (
            <Table
              aria-label={t('consumerGroup.topic_table_aria')}
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
          ) : (
            <Table
              aria-label={t('consumerGroup.topic_table_aria')}
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
          )}
          <Divider />
          {rowData.length < 1 ? (
            <EmptyConsumers />
          ) : (
            <Pagination
              itemCount={rowData.length}
              perPage={perPage}
              page={page}
              onSetPage={onSetPage}
              widgetId='consumer-group-pagination-bottom'
              onPerPageSelect={onPerPageSelect}
              offset={0}
              variant={PaginationVariant.bottom}
            />
          )}
        </DrawerContent>
      </Drawer>
      <Divider />
    </>
  );
};
