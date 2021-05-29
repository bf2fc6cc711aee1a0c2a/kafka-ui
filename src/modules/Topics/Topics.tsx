import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  Button,
  Card,
  Chip,
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
import { ConfigContext, AlertContext, useFederated } from "@app/contexts";
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

export type TopicsProps = {
  onCreateTopic?: () => void;
};

export const Topics: React.FC<TopicsProps> = ({ onCreateTopic }) => {
  const {
    onConnectToRoute,
    getConnectToRoutePath,
    dispatchKafkaAction,
    onError,
  } = useFederated();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState<TopicsList>();
  const [deleteModal, setDeleteModal] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState<boolean>(false);
  const [searchTopicName, setSearchTopicName] = useState<string>("");
  const [topicName, setTopicName] = useState<string | undefined>();

  const { t } = useTranslation();

  const { addAlert } = useContext(AlertContext);

  const config = useContext(ConfigContext);

  const onClickCreateTopic = () => {
    onCreateTopic && onCreateTopic();
    dispatchKafkaAction && dispatchKafkaAction("topic-create");
  };

  const fetchTopic = async () => {
    try {
      if (!filteredTopics) {
        const topicsList = await getTopics(config);
        if (topicsList) {
          setTopics(topicsList);
        }
      } else {
        const topicsList = await getTopics(config, searchTopicName);
        if (topicsList) {
          setTopics(topicsList);
        }
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
    fetchTopic();
  }, [deleteModal, searchTopicName]);

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

  const onChipDelete = () => {
    setFilteredTopics(false);
    setSearchTopicName("");
  };

  const rowData =
    topics?.items?.map((topic) => [
      {
        title: (
          <Link
            data-testid="tableTopics-linkTopic"
            to={
              (getConnectToRoutePath &&
                getConnectToRoutePath(`topics/${topic.name}`, topic.name)) ||
              ""
            }
            onClick={(e) => {
              e.preventDefault();
              onConnectToRoute && onConnectToRoute(`topics/${topic.name}`);
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

  const onDelete = (rowId: any) => {
    if (topics?.items) {
      setTopicName(topics.items[rowId].name);
    }
    setDeleteModal(true);
  };

  const onEdit = (rowId: any) => {
    if (topics?.items) {
      const topicName = topics.items[rowId].name;
      onConnectToRoute && onConnectToRoute(`topics/${topicName}`);
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
        />
      )}
      <Card className="kafka-ui-m-full-height">
        {rowData.length < 1 && searchTopicName.length < 1 ? (
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
              onClick: onClickCreateTopic,
            }}
          />
        ) : (
          <Card>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem className="pf-c-toolbar-item--search">
                  <SearchTopics
                    search={search}
                    setSearch={setSearch}
                    setFilteredTopics={setFilteredTopics}
                    setSearchTopicName={setSearchTopicName}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    id="topic-list-create-topic-button"
                    className="topics-per-page"
                    data-testid="tabTopics-actionCreate"
                    onClick={onCreateTopic}
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
            {filteredTopics && (
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <Chip key="topicFilterChip" onClick={onChipDelete}>
                      {searchTopicName}
                    </Chip>
                    <Button
                      variant="link"
                      onClick={onChipDelete}
                      aria-label="clear-filters"
                    >
                      {t("common.clear_filters")}
                    </Button>
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
            )}
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
        <Divider />
        {rowData.length < 1 && searchTopicName.length > 0 && (
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
        {rowData.length > 0 && (
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
