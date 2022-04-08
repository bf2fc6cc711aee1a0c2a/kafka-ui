import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PaginationVariant } from '@patternfly/react-core';
import {
  TableVariant,
  IRowData,
  OnSort,
  ISortBy,
  sortable,
  info,
  IAction,
  IActionsResolver,
} from '@patternfly/react-table';
import { ConsumerGroup } from '@rhoas/kafka-instance-sdk';
import {
  MASTable,
  MASPagination,
  EmptyState,
  MASEmptyStateVariant,
  MASTableProps,
} from '@app/components';
import {
  ConsumerGroupToolbar,
  ConsumerGroupToolbarProps,
} from './ConsumerGroupToolbar';
import {
  ModalType,
  ModalTypePropsMap,
  useModal,
} from '@rhoas/app-services-ui-shared';
import { ConsumerGroupState } from '../ConsumerGroupState';
// import { ConsumerGroupState } from '@rhoas/kafka-instance-sdk';

export type ConsumerGroupsTableProps = ConsumerGroupToolbarProps & {
  consumerGroups?: ConsumerGroup[];
  rowDataTestId?: string;
  isDrawerOpen?: boolean;
  onViewConsumerGroup: (consumerGroup: ConsumerGroup) => void;
  refreshConsumerGroups?: () => void;
  onSort: OnSort;
  sortBy: ISortBy;
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
  onSort,
  sortBy,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const { showModal } = useModal<ModalType.KafkaDeleteConsumerGroup>();
  const { showModal: showResetOffsetModal } =
    useModal<ModalType.KafkaConsumerGroupResetOffset>();
  const [activeRow, setActiveRow] = useState<string>();

  const tableColumns = [
    { title: t('consumerGroup.consumer_group_id'), transforms: [sortable] },
    { title: t('consumerGroup.active_members') },
    {
      title: t('consumerGroup.partitions_with_lag'),
      transforms: [
        info({
          popover: (
            <div>{t('consumerGroup.partitions_with_lag_description')}</div>
          ),
          ariaLabel: 'partitions with lag',
          popoverProps: {
            headerContent: t('consumerGroup.partitions_with_lag_name'),
          },
        }),
      ],
    },
    { title: t('consumerGroup.state_label') },
  ];

  useEffect(() => {
    if (!isDrawerOpen) {
      setActiveRow('');
    }
  }, [isDrawerOpen]);

  const preparedTableCells = () => {
    const tableRow: (IRowData | string[])[] | undefined = [];
    consumerGroups?.map((row: IRowData) => {
      const { groupId, consumers, state } = row;
      tableRow.push({
        cells: [
          groupId,
          consumers.reduce(function (prev: number, cur: { partition: number }) {
            return prev + (cur.partition != -1 ? 1 : 0);
          }, 0),
          consumers.reduce(function (prev: number, cur: { lag: number }) {
            return prev + (cur.lag > 0 ? 1 : 0);
          }, 0),
          ConsumerGroupState(state),
        ],
        originalData: { ...row, rowId: groupId },
      });
    });

    return tableRow;
  };

  const onSelectDeleteConsumerGroup = (
    groupId: string,
    state: string | undefined
  ) => {
    showModal(ModalType.KafkaDeleteConsumerGroup, {
      consumerName: groupId,
      refreshConsumerGroups,
      state,
    });
  };

  const onSelectResetOffsetConsumerGroup = (data: ConsumerGroup) => {
    showResetOffsetModal(ModalType.KafkaConsumerGroupResetOffset, {
      refreshConsumerGroups,
      consumerGroupData:
        data as ModalTypePropsMap[ModalType.KafkaConsumerGroupResetOffset]['consumerGroupData'],
    });
  };

  const onSelectKebabDropdownOption = (
    //event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    originalData: ConsumerGroup
  ) => {
    const { groupId, state } = originalData;
    //set selected row for view consumer group details
    setActiveRow(groupId);
    onSelectDeleteConsumerGroup(groupId, state);
    // Set focus back on previous selected element i.e. kebab button
    //event?.target?.parentElement?.parentElement?.previousSibling?.focus();
  };

  const onSelectResetOffset = (
    //event: any,
    originalData: ConsumerGroup
  ) => {
    onSelectResetOffsetConsumerGroup(originalData);
  };

  const onClickDrawerButton = (row: IRowData) => {
    const { originalData } = row;
    onViewConsumerGroup(originalData);
    setActiveRow(originalData?.groupId);
  };

  const actionResolver: IActionsResolver = (rowData: IRowData) => {
    const originalData: ConsumerGroup = rowData.originalData;
    const onDelete: IAction = {
      title: t('common.delete'),
      onClick: () => onSelectKebabDropdownOption(originalData),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onDelete['data-testid'] = 'tableConsumers-actionDelete';

    const onViewOffset: IAction = {
      title: t('consumerGroup.view_partitions_offsets'),
      onClick: (_, __, row) => onClickDrawerButton(row),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onViewOffset['data-testid'] = 'tableConsumers-actionOpenDrawer';

    const onReset: IAction = {
      title: t('consumerGroup.reset_offset'),
      onClick: () => onSelectResetOffset(originalData),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onReset['data-testid'] = 'tableConsumers-resetOffset';

    return [onDelete, onViewOffset, onReset];
  };

  const onRowClick: MASTableProps['onRowClick'] = (event, _, row) => {
    if (event?.target) {
      const { originalData } = row || {};
      const tagName = (
        (event?.target as unknown as HTMLElement).tagName || ''
      ).toLocaleLowerCase();
      // Open modal on row click except kebab button click
      if (tagName !== 'button' && tagName !== 'a') {
        onViewConsumerGroup(originalData);
        setActiveRow(originalData?.groupId);
      }
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
          'aria-label': t('consumerGroup.consumer_group_list'),
          actionResolver: actionResolver,
          shouldDefaultCustomRowWrapper: true,
          variant: TableVariant.compact,
          onSort,
          sortBy,
        }}
        activeRow={activeRow}
        onRowClick={onRowClick}
        rowDataTestId={rowDataTestId || 'tableConsumers-row'}
      />
      {total < 1 && search.length > 0 && (
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
export default ConsumerGroupsTable;
