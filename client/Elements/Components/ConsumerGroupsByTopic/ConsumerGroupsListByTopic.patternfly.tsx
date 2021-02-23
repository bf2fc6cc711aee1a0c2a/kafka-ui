/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useState } from "react";
import {
  Label,
  Card,
  Divider,
  Pagination,
  Toolbar,
  Button,
  ToolbarContent,
  Drawer,
  DrawerContent,
  ToolbarItem,
  Title,
} from "@patternfly/react-core";
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from "@patternfly/react-table";
import { ConsumerGroupDataByTopics } from "./ConsumerDataByTopics";
import { ConsumerGroupsByTopicDrawer } from "./ConsumerGroupsByTopicsDrawer.patternfly";
import {
  SearchConsumerGroupsByTopics,
  IConsumerGroupByTopic,
} from "./SearchConsumerGroupsByTopics.patternfly";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/js/icons/exclamation-circle-icon";
import CheckCircleIcon from "@patternfly/react-icons/dist/js/icons/check-circle-icon";
import { EmptySearch } from "../Topics/EmptySearch.patternfly";

export const ConsumerGroupByTopicList: React.FunctionComponent = () => {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [offset, setOffset] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [consumerGroupDetail, setConsumerGroupDetail] = useState<
    IConsumerGroupByTopic
  >();
  const [tableData, setTableData] = useState(ConsumerGroupDataByTopics);

  const onSetPage = (_event, pageNumber: number) => {
    setPage(pageNumber);
    setOffset(page * perPage);
  };

  const onPerPageSelect = (_event, perPage: number) => {
    setPerPage(perPage);
  };

  const onClickConsumerGroup = (
    id: string,
    members: number,
    partitions: number,
    state: string
  ) => {
    const consumerDetail = { id, members, partitions, state };
    setConsumerGroupDetail(consumerDetail);
    setIsExpanded(true);
  };
  const panelContent = (
    <ConsumerGroupsByTopicDrawer
      consumerGroupDetail={consumerGroupDetail}
      isExpanded={setIsExpanded}
    />
  );

  const tableColumns = [
    { title: "Consumer group ID" },
    { title: "Active members for this topic" },
    { title: "Unconsumed partitions for this topic" },
    { title: "State" },
  ];
  const rowData = tableData.map((ConsumerGroupByTopic) => [
    {
      title: (
        <Button
          variant="link"
          onClick={() =>
            onClickConsumerGroup(
              ConsumerGroupByTopic.id,
              ConsumerGroupByTopic.members,
              ConsumerGroupByTopic.partitions,
              ConsumerGroupByTopic.state
            )
          }
        >
          {ConsumerGroupByTopic.id}
        </Button>
      ),
    },
    ConsumerGroupByTopic?.members,
    ConsumerGroupByTopic?.partitions,
    {
      title: (
        <Label
          color={ConsumerGroupByTopic.state === "Stable" ? "green" : "red"}
          icon={
            ConsumerGroupByTopic.state === "Stable" ? (
              <CheckCircleIcon />
            ) : (
              <ExclamationCircleIcon />
            )
          }
        >
          {ConsumerGroupByTopic.state}
        </Label>
      ),
    },
  ]);

  return (
    <>
      <Card>
        <Title headingLevel="h4"> </Title>
        <Drawer isExpanded={isExpanded}>
          <DrawerContent panelContent={panelContent}>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <SearchConsumerGroupsByTopics setTableData={setTableData} />
                </ToolbarItem>

                <ToolbarItem variant="pagination">
                  <Pagination
                    itemCount={rowData.length}
                    perPage={perPage}
                    page={page}
                    onSetPage={onSetPage}
                    widgetId="pagination-options-menu-top"
                    onPerPageSelect={onPerPageSelect}
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
            <Divider />

            <Table
              aria-label="Compact Table"
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

            {rowData.length > 0 ? (
              <Pagination
                itemCount={rowData.length}
                perPage={perPage}
                page={page}
                onSetPage={onSetPage}
                widgetId="pagination-options-menu-top"
                onPerPageSelect={onPerPageSelect}
                offset={0}
              />
            ) : (
              <EmptySearch />
            )}
          </DrawerContent>
        </Drawer>
      </Card>
    </>
  );
};
