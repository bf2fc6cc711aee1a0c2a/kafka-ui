import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PaginationVariant } from '@patternfly/react-core';
import {
  TableVariant,
  sortable,
  IRowData,
  OnSort,
  ISortBy,
} from '@patternfly/react-table';
import { useBasename } from '@rhoas/app-services-ui-shared';
import {
  MASTable,
  MASPagination,
  EmptyState,
  MASEmptyStateVariant,
} from '@app/components';
import { Topic } from '@rhoas/kafka-instance-sdk';
import { TopicsToolbar, TopicsToolbarProps } from './TopicsToolbar';
import { convertRetentionSize, convertRetentionTime } from '@app/utils';
import { useModal, ModalType } from '@app/components';

export type TopicsTableProps = TopicsToolbarProps & {
  topicItems: Topic[];
  rowDataTestId?: string;
  filteredValue: string;
  onEdit?: (topicName?: string | undefined) => void;
  onDeleteTopic?: () => void;
  refreshTopics: () => void;
  onSort: OnSort;
  sortBy: ISortBy;
};

const TopicsTable: React.FC<TopicsTableProps> = ({
  total,
  page,
  perPage,
  setFilteredValue,
  filteredValue,
  onCreateTopic,
  topicItems,
  rowDataTestId,
  onEdit,
  onDeleteTopic,
  refreshTopics,
  onSort,
  sortBy,
}) => {
  const { t } = useTranslation();
  const { showModal } = useModal<ModalType.DeleteTopic>();
  const { getBasename } = useBasename() || { getBasename: () => '' };
  const basename = getBasename();

  const tableColumns = [
    { title: t('common.name') },
    { title: t('common.partitions'), transforms: [sortable] },
    { title: t('topic.retention_time'), transforms: [sortable] },
    { title: t('topic.retention_size'), transforms: [sortable] },
  ];

  const onDelete = (topicName: string) => {
    showModal(ModalType.DeleteTopic, {
      topicName,
      onDeleteTopic,
      refreshTopics,
    });
  };

  const onSelectKebabDropdownOption = (
    //event: React.MouseEvent<HTMLElement>,
    originalData: Topic,
    action: string
  ) => {
    const { name = '' } = originalData;
    if (action === 'delete') {
      onDelete(name);
    } else if (action === 'edit') {
      onEdit && onEdit(name);
    }
    // Set focus back on previous selected element i.e. kebab button
    //event?.target?.parentElement?.parentElement?.previousSibling?.focus();
  };

  const actionResolver = (rowData: IRowData) => {
    const originalData: Topic = rowData.originalData;
    const resolver = [
      {
        title: t('common.delete'),
        ['data-testid']: 'tableTopics-actionDelete',
        onClick: () => onSelectKebabDropdownOption(originalData, 'delete'),
      },
      {
        title: t('common.edit'),
        ['data-testid']: 'tableTopics-actionEdit',
        onClick: () => onSelectKebabDropdownOption(originalData, 'edit'),
      },
    ];
    return resolver;
  };

  const preparedTableCells = () => {
    const tableRow: (IRowData | string[])[] | undefined = [];
    topicItems?.map((row: IRowData) => {
      const { name, partitions, config } = row;

      tableRow.push({
        cells: [
          {
            title: (
              <Link
                data-testid='tableTopics-linkTopic'
                to={`${basename}/topics/${name}`}
              >
                {name}
              </Link>
            ),
          },
          partitions?.length,
          convertRetentionTime(
            Number(
              config?.filter((element) => element.key === 'retention.ms')[0]
                ?.value || 0
            )
          ),
          convertRetentionSize(
            Number(
              config?.filter((element) => element.key === 'retention.bytes')[0]
                ?.value || 0
            )
          ),
        ],
        originalData: row,
      });
    });
    return tableRow;
  };

  const rows = preparedTableCells();

  return (
    <>
      <TopicsToolbar
        total={total}
        page={page}
        perPage={perPage}
        onCreateTopic={onCreateTopic}
        setFilteredValue={setFilteredValue}
        filteredValue={filteredValue}
      />
      <MASTable
        tableProps={{
          cells: tableColumns,
          rows,
          'aria-label': t('topic.topic_list_table'),
          actionResolver: actionResolver,
          shouldDefaultCustomRowWrapper: true,
          variant: TableVariant.compact,
          onSort,
          sortBy,
        }}
        rowDataTestId={rowDataTestId || 'tableTopics-row'}
      />
      {topicItems?.length < 1 && filteredValue.length > 0 && (
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

export { TopicsTable };
