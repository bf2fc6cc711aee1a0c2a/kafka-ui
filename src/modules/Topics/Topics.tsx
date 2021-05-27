import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
} from "@patternfly/react-core";
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
  sortable,
} from "@patternfly/react-table";
import { useTimeout } from "@app/hooks/useTimeOut";
import { SearchTopics } from "./components/SearchTopics/SearchTopics";
import { EmptyState, MASEmptyStateVariant, Loading } from "@app/components";
import { getTopics } from "@app/services";
import { DeleteTopics } from "./dialogs/DeleteTopicsModal";
import { ConfigContext, AlertContext } from "@app/contexts";
import { TopicsList } from "@app/openapi";
import "./Topics.css";
import { convertRetentionSize, convertRetentionTime } from "./utils";

export type ITopic = {
  name: string;
  replicas: number;
  partitions: number;
};

export type ITopicProps = {
  rows: ITopic[];
};

export type ITopics = {
  onCreateTopic: () => void;
  onClickTopic: (topicName: string | undefined) => void;
  getTopicDetailsPath: (topic: string | undefined) => string;
  onDeleteTopic: () => void;
  onError?: (errorCode: number, message: string) => void;
};

export const Topics: React.FunctionComponent<ITopics> = ({
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
  const [search, setSearch] = useState("");
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
    { title: t("common.name") },
    { title: t("common.partitions"), transforms: [sortable] },
    { title: t("topic.retention_time"), transforms: [sortable] },
    { title: t("topic.retention_size"), transforms: [sortable] },
  ];

  const rowData =
    filteredTopics?.items?.map((topic) => [
      {
        title: (
          <Link
            data-testid="tableTopics-linkTopic"
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
          topic.config?.filter((element) => element.key === "retention.ms")[0]
            ?.value || 0
        )
      ),

      convertRetentionSize(
        Number(
          topic.config?.filter(
            (element) => element.key === "retention.bytes"
          )[0]?.value || 0
        )
      ),
    ]) || [];

  useEffect(() => {
    if (
      search &&
      search.trim() != "" &&
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
      title: t("common.delete"),
      ["data-testid"]: "tableTopics-actionDelete",
      onClick: (_, rowId) => onDelete(rowId),
    },
    {
      title: t("common.edit"),
      ["data-testid"]: "tableTopics-actionEdit",
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
      <Card className="kafka-ui-m-full-height">
        {rowData.length < 1 && search.length < 1 ? (
          <EmptyState
            emptyStateProps={{
              variant: MASEmptyStateVariant.NoItems,
            }}
            titleProps={{
              title: t("topic.empty_topics_title"),
            }}
            emptyStateBodyProps={{
              body: t("topic.empty_topics_body"),
            }}
            buttonProps={{
              title: t("topic.create_topic"),
              onClick: onCreateTopic,
            }}
          />
        ) : (
          <Card>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem className="pf-c-toolbar-item--search">
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
                    data-testid="tabTopics-actionCreate"
                    onClick={() => {
                      onCreateTopic();
                    }}
                  >
                    {t("topic.create_topic")}
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

            <Table
              aria-label={t("topic.topic_list_table")}
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
        {rowData.length < 1 && search.length > 1 && (
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
        {rowData.length > 1 && (
          <Card>
            <Divider />
            <Pagination
              itemCount={rowData.length}
              perPage={perPage}
              page={page}
              onSetPage={onSetPage}
              widgetId="topic-list-pagination-bottom"
              onPerPageSelect={onPerPageSelect}
              offset={0}
              variant={PaginationVariant.bottom}
            />
          </Card>
        )}
      </Card>
    </>
  );
};
