import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, PaginationVariant } from "@patternfly/react-core";
import { IActions, TableVariant, IRowData } from "@patternfly/react-table";
import { ConsumerGroup } from "@app/openapi";
import {
  MASTable,
  useRootModalContext,
  MODAL_TYPES,
  MASPagination,
  EmptyState,
  MASEmptyStateVariant,
} from "@app/components";
import {
  ConsumerGroupToolbar,
  ConsumerGroupToolbarProps,
} from "./ConsumerGroupToolbar";

export type ConsumerGroupsTableProps = ConsumerGroupToolbarProps & {
  consumerGroups: ConsumerGroup[];
  detailsDataId?: string;
  rowDataId?: string;
  fetchConsumerGroupDetail: (groupId: string) => void;
  onViewConsumerGroup: (consumerGroup: ConsumerGroup) => void;
};

const ConsumerGroupsTable: React.FC<ConsumerGroupsTableProps> = ({
  consumerGroups,
  detailsDataId,
  total,
  page,
  perPage,
  search,
  setSearch,
  fetchConsumerGroupDetail,
  onViewConsumerGroup,
}) => {
  const { t } = useTranslation();
  const { showModal } = useRootModalContext();
  const [activeRow, setActiveRow] = useState<string>();

  const tableColumns = [
    { title: t("consumerGroup.consumer_group_id") },
    { title: t("consumerGroup.active_members") },
    { title: t("consumerGroup.partitions_with_lag") },
  ];

  const preparedTableCells = () => {
    const rowData =
      consumerGroups?.map((consumer) => [
        {
          title: (
            <Button
              variant="link"
              isInline
              onClick={() => fetchConsumerGroupDetail(consumer.groupId)}
              data-testid={detailsDataId || "tableConsumers-actionDetails"}
            >
              {consumer.groupId}
            </Button>
          ),
          originalData: consumer,
        },

        consumer.consumers.reduce(function (prev, cur) {
          return prev + (cur.partition != -1 ? 1 : 0);
        }, 0),
        consumer.consumers.reduce(function (prev, cur) {
          return prev + (cur.lag > 0 ? 1 : 0);
        }, 0),
      ]) || [];
    return rowData;
  };

  const onSelectDeleteConsumerGroup = (groupId: string) => {
    showModal(MODAL_TYPES.DELETE_CONSUMER_GROUP, {
      consumerName: groupId,
    });
  };

  const onSelectKebabDropdownOption = (
    event: React.ChangeEvent<HTMLSelectElement>,
    originalData: ConsumerGroup
  ) => {
    const { groupId } = originalData;
    //set selected row for view consumer group details
    setActiveRow(groupId);
    onSelectDeleteConsumerGroup(groupId);
    // Set focus back on previous selected element i.e. kebab button
    //event?.target?.parentElement?.parentElement?.previousSibling?.focus();
  };

  const actionResolver = (rowData: IRowData) => {
    const originalData: ConsumerGroup = rowData.originalData;
    const resolver: IActions = [
      {
        title: t("common.delete"),
        // ["data-testid"]: "tableConsumers-actionDelete",
        // onClick: (event: React.ChangeEvent<HTMLSelectElement>) =>
        //   onSelectKebabDropdownOption(event, originalData),
      },
    ];
    return resolver;
  };

  const onRowClick = (event: any, rowIndex: number, row: IRowData) => {
    const { originalData } = row;
    const tagName = event?.target?.tagName;
    // Open modal on row click except kebab button click
    if (tagName?.toLowerCase() !== "a") {
      onViewConsumerGroup(originalData);
      setActiveRow(originalData?.name);
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
          "aria-label": t("cluster_instance_list"),
          actionResolver: actionResolver,
          shouldDefaultCustomRowWrapper: true,
          variant: TableVariant.compact,
        }}
        activeRow={activeRow}
        onRowClick={onRowClick}
        rowDataTestId="tableConsumers-row"
      />
      {consumerGroups?.length < 1 && (
        <EmptyState
          emptyStateProps={{
            variant: MASEmptyStateVariant.NoResult,
          }}
          titleProps={{
            title: t("common.no_results_title"),
          }}
          emptyStateBodyProps={{
            body: t("common.no_results_body"),
          }}
        />
      )}

      {total > 0 && (
        <MASPagination
          widgetId="consumer-group-pagination-options-menu-bottom"
          itemCount={total}
          variant={PaginationVariant.bottom}
          page={page}
          perPage={perPage}
          titles={{
            paginationTitle: t("common.full_pagination"),
            perPageSuffix: t("common.per_page_suffix"),
            toFirstPage: t("common.to_first_page"),
            toPreviousPage: t("common.to_previous_page"),
            toLastPage: t("common.to_last_page"),
            toNextPage: t("common.to_next_page"),
            optionsToggle: t("common.options_toggle"),
            currPage: t("common.curr_page"),
          }}
        />
      )}
    </>
  );
};

export { ConsumerGroupsTable };
