/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Pagination,
  Toolbar,
  Title,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from "@patternfly/react-table";
import { SearchTopics } from "./SearchTopics.patternfly";
import { EmptyTopics } from "./EmptyTopics.patternfly";
import { EmptySearch } from "./EmptySearch.patternfly";
import { useTopicsModel } from "../../../Panels/Topics/Model";
import { TopicList } from "Entities/Entities.generated";

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

export const TopicsList: React.FunctionComponent<ITopicList> = ({
  onCreateTopic,
}) => {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState<TopicList>();
  const [filteredTopics, setFilteredTopics] = useState<TopicList>();

  const fetchTopic = async () => {
    const { model } = await useTopicsModel();
    if (model.data) {
      setTopics(model.data as TopicList);
      setFilteredTopics(model.data as TopicList);
    }
  };

  useEffect(() => {
    fetchTopic();
  }, []);

  const onSetPage = (_event, pageNumber: number) => {
    setPage(pageNumber);
    setOffset(page * perPage);
  };

  const onPerPageSelect = (_event, perPage: number) => {
    setPerPage(perPage);
  };

  const tableColumns = [
    { title: "Name" },
    { title: "Replicas" },
    { title: "Partitions" },
  ];
  const rowData =
    filteredTopics?.topics.map((topic) => [
      topic?.name,
      topic?.partitions
        ?.map((p) => p.replicas.length)
        .reduce((previousValue, currentValue) => previousValue + currentValue),
      topic?.partitions?.length,
    ]) || [];

  useEffect(() => {
    if (
      search &&
      search.trim() != "" &&
      topics?.topics &&
      topics.topics.length > 0
    ) {
      const filterSearch = topics?.topics.filter(
        (topicsFiltered) =>
          topicsFiltered?.name && topicsFiltered.name.includes(search)
      );
      setFilteredTopics((prevState) => ({
        ...prevState,
        topics: filterSearch,
      }));
    } else {
      setFilteredTopics(topics);
    }
  }, [search]);

  const onClear = () => {
    setFilteredTopics(topics);
  };

  const actions = [{ title: "Edit" }, { title: "Delete" }];
  return (
    <>
      <Title headingLevel="h2" size="lg">
        Topics
      </Title>
      {rowData.length < 1 && search.length < 1 ? (
        <EmptyTopics />
      ) : (
        <Card>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <SearchTopics
                  onClear={onClear}
                  search={search}
                  setSearch={setSearch}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  id="topic-list-create-topic-button"
                  className="topics-per-page"
                  onClick={() => {
                    onCreateTopic();
                  }}
                >
                  Create topic
                </Button>
              </ToolbarItem>
              <ToolbarItem variant="pagination">
                <Pagination
                  itemCount={rowData.length}
                  perPage={perPage}
                  page={page}
                  onSetPage={onSetPage}
                  widgetId="topic-list-pagination-top"
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
            actions={actions}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </Card>
      )}
      {rowData.length < 1 && search.length > 1 && <EmptySearch />}
      {rowData.length > 1 && (
        <Pagination
          itemCount={rowData.length}
          perPage={perPage}
          page={page}
          onSetPage={onSetPage}
          widgetId="topic-list-pagination-bottom"
          onPerPageSelect={onPerPageSelect}
          offset={0}
        />
      )}
    </>
  );
};
