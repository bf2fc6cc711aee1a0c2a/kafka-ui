import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PaginationVariant } from '@patternfly/react-core';
import { TableVariant, IRowData } from '@patternfly/react-table';
import { ConsumerGroup } from '@rhoas/kafka-instance-sdk';
import {
  MASTable,
  useRootModalContext,
  MODAL_TYPES,
  MASPagination,
  EmptyState,
  MASEmptyStateVariant,
} from '@app/components';
import {
  ConsumerGroupToolbar,
  ConsumerGroupToolbarProps,
} from './ConsumerGroupToolbar';

export type ConsumerGroupsTableProps = ConsumerGroupToolbarProps & {
  consumerGroups: ConsumerGroup[];
  rowDataTestId?: string;
  isDrawerOpen?: boolean;
  onViewConsumerGroup: (consumerGroup: ConsumerGroup) => void;
  refreshConsumerGroups?: () => void;
  consumerGroupByTopic: boolean;
};

const ConsumerGroupsTable: React.FC<ConsumerGroupsTableProps> = ({
  consumerGroups,
  total,
  page,
  perPage,
  search,
  setSearch,
  rowDataTestId,
  isDrawerOpen,
  onViewConsumerGroup,
  refreshConsumerGroups,
  consumerGroupByTopic,
}) => {
  const { t } = useTranslation();
  const { showModal } = useRootModalContext();
  const [activeRow, setActiveRow] = useState<string>();

  const tableColumns = [
    { title: t('consumerGroup.consumer_group_id') },
    { title: t('consumerGroup.active_members') },
    { title: t('consumerGroup.partitions_with_lag') },
  ];

  useEffect(() => {
    if (!isDrawerOpen) {
      setActiveRow('');
    }
  }, [isDrawerOpen]);

  const preparedTableCells = () => {
    const tableRow: (IRowData | string[])[] | undefined = [];
    consumerGroups?.map((row: IRowData) => {
      const { groupId, consumers } = row;
      tableRow.push({
        cells: [
          groupId,
          consumers.reduce(function (prev, cur) {
            return prev + (cur.partition != -1 ? 1 : 0);
          }, 0),
          consumers.reduce(function (prev, cur) {
            return prev + (cur.lag > 0 ? 1 : 0);
          }, 0),
        ],
        originalData: { ...row, rowId: groupId },
      });
    });
    return tableRow;
  };

  const onSelectDeleteConsumerGroup = (groupId: string) => {
    showModal(MODAL_TYPES.DELETE_CONSUMER_GROUP, {
      consumerName: groupId,
      refreshConsumerGroups,
    });
  };

  const onSelectKebabDropdownOption = (
    event: any,
    originalData: ConsumerGroup
  ) => {
    const { groupId } = originalData;
    //set selected row for view consumer group details
    setActiveRow(groupId);
    onSelectDeleteConsumerGroup(groupId);
    // Set focus back on previous selected element i.e. kebab button
    event?.target?.parentElement?.parentElement?.previousSibling?.focus();
  };

  const onClickDrawerButton = (row: IRowData) => {
    const { originalData } = row;
    onViewConsumerGroup(originalData);
    setActiveRow(originalData?.groupId);
  };

  const actionResolver = (rowData: IRowData) => {
    if (consumerGroupByTopic) {
      return [];
    }
    const originalData: ConsumerGroup = rowData.originalData;
    const resolver = [
      {
        title: t('common.delete'),
        ['data-testid']: 'tableConsumers-actionDelete',
        onClick: (event: any) =>
          onSelectKebabDropdownOption(event, originalData),
      },
      {
        title: t('consumerGroup.view_partitions'),
        ['data-testid']: 'tableConsumers-actionOpenDrawer',
        onClick: (_, __, row: IRowData) => onClickDrawerButton(row),
      },
    ];
    return resolver;
  };

  const onRowClick = (event: any, rowIndex: number, row: IRowData) => {
    const { originalData } = row;
    const clickedEventType = event?.target?.type;
    const tagName = event?.target?.tagName;
    // Open modal on row click except kebab button click
    if (clickedEventType !== 'button' && tagName?.toLowerCase() !== 'a') {
      onViewConsumerGroup(originalData);
      setActiveRow(originalData?.groupId);
    }
  };

  return (
    <>
      <ConsumerGroupToolbar
        search={search}
        setSearch={setSearch}
        total={total}
        perPage={perPage}
        page={page}
      />
      <MASTable
        tableProps={{
          cells: tableColumns,
          rows: preparedTableCells(),
          'aria-label': t('cluster_instance_list'),
          actionResolver: actionResolver,
          shouldDefaultCustomRowWrapper: true,
          variant: TableVariant.compact,
        }}
        activeRow={activeRow}
        onRowClick={onRowClick}
        rowDataTestId={rowDataTestId || 'tableConsumers-row'}
      />
      {consumerGroups?.length < 1 && (
        <EmptyState
          emptyStateProps={{
            variant: MASEmptyStateVariant.NoResult,
          }}
          titleProps={{
            title: t('common.no_results_title'),
          }}
          emptyStateBodyProps={{
            body: t('common.no_results_body'),
          }}
        />
      )}

      {total > 0 && (
        <MASPagination
          widgetId='consumer-group-pagination-options-menu-bottom'
          itemCount={total}
          variant={PaginationVariant.bottom}
          page={page}
          perPage={perPage}
          titles={{
            paginationTitle: t('common.full_pagination'),
            perPageSuffix: t('common.per_page_suffix'),
            toFirstPage: t('common.to_first_page'),
            toPreviousPage: t('common.to_previous_page'),
            toLastPage: t('common.to_last_page'),
            toNextPage: t('common.to_next_page'),
            optionsToggle: t('common.options_toggle'),
            currPage: t('common.curr_page'),
          }}
        />
      )}
    </>
  );
};

export { ConsumerGroupsTable };
