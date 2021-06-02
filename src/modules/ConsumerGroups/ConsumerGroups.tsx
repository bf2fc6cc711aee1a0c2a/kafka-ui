import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  AlertVariant,
  Card,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";
import {
  EmptyState,
  MASEmptyStateVariant,
  MASLoading,
  MASDrawer,
} from "@app/components";
import { getConsumerGroups } from "@app/services";
import { ConfigContext, AlertContext } from "@app/contexts";
import { ConsumerGroupList, ConsumerGroup } from "@app/openapi";
import { useTimeout } from "@app/hooks/useTimeOut";
import { ConsumerGroupDetail, ConsumerGroupsTable } from "./components";

export type ConsumerGroupsProps = {
  consumerGroupByTopic: boolean;
  topic?: string;
  rowDataTestId?: string;
};

export const ConsumerGroups: React.FunctionComponent<ConsumerGroupsProps> = ({
  consumerGroupByTopic,
  topic,
  rowDataTestId,
}) => {
  const [offset, setOffset] = useState<number>(0);
  const [consumerGroups, setConsumerGroups] = useState<
    ConsumerGroupList | undefined
  >();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [
    consumerGroupDetail,
    setConsumerGroupDetail,
  ] = useState<ConsumerGroup>();
  const [
    filteredConsumerGroups,
    setFilteredConsumerGroups,
  ] = useState<ConsumerGroupList>();

  const config = useContext(ConfigContext);
  const { addAlert } = useContext(AlertContext);
  const { t } = useTranslation();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get("page") || "", 10) || 1;
  const perPage = parseInt(searchParams.get("perPage") || "", 10) || 10;

  useEffect(() => {
    setOffset(page * perPage);
  }, [page, perPage]);

  const fetchConsumerGroups = async () => {
    let limit: number | undefined = undefined;
    let offsetVal: number | undefined = undefined;
    let topicName: string | undefined = undefined;
    /**
     * limit, offset and topic will pass for consumer groups for topic
     */
    if (consumerGroupByTopic && topic) {
      limit = 100;
      offsetVal = offset;
      topicName = topic;
    }

    try {
      await getConsumerGroups(config, limit, offsetVal, topicName).then(
        (response) => {
          setConsumerGroups(response);
          setFilteredConsumerGroups(response);
        }
      );
    } catch (err) {
      addAlert(err.response.data.error_message, AlertVariant.danger);
    }
  };

  useEffect(() => {
    fetchConsumerGroups();
  }, []);

  const filterConsumerGroups = () => {
    if (
      search &&
      search.trim() != "" &&
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
  };

  useEffect(() => {
    filterConsumerGroups();
  }, [search, consumerGroups]);

  useTimeout(() => fetchConsumerGroups(), 5000);

  const panelBodyContent = (
    <ConsumerGroupDetail consumerDetail={consumerGroupDetail} />
  );

  const onClose = () => {
    setIsExpanded(false);
  };

  const onViewConsumerGroup = (consumerGroup) => {
    setIsExpanded(true);
    setConsumerGroupDetail(consumerGroup);
  };

  const renderConsumerTable = () => {
    if (consumerGroups === undefined) {
      return (
        <PageSection
          className="kafka-ui-m-full-height"
          variant={PageSectionVariants.light}
          padding={{ default: "noPadding" }}
        >
          <MASLoading />
        </PageSection>
      );
    } else if (
      consumerGroups &&
      consumerGroups?.count < 1 &&
      search.length < 1
    ) {
      return (
        <Card className="kafka-ui-m-full-height">
          <EmptyState
            emptyStateProps={{
              variant: MASEmptyStateVariant.NoConsumerGroups,
            }}
            titleProps={{
              title: t("consumerGroup.empty_consumer_title"),
            }}
            emptyStateBodyProps={{
              body: t("consumerGroup.empty_consumer_body"),
            }}
          />
        </Card>
      );
    } else if (filteredConsumerGroups) {
      return (
        <ConsumerGroupsTable
          consumerGroups={filteredConsumerGroups?.items}
          total={filteredConsumerGroups?.items?.length}
          page={page}
          perPage={perPage}
          search={search}
          setSearch={setSearch}
          rowDataTestId={rowDataTestId}
          onViewConsumerGroup={onViewConsumerGroup}
          isDrawerOpen={isExpanded}
          refreshConsumerGroups={fetchConsumerGroups}
        />
      );
    }
    return <></>;
  };

  return (
    <MASDrawer
      isExpanded={isExpanded}
      onClose={onClose}
      panelBodyContent={panelBodyContent}
      drawerHeaderProps={{
        text: { label: t("consumerGroup.consumer_group_id") },
        title: { value: consumerGroupDetail?.groupId, headingLevel: "h1" },
      }}
      data-ouia-app-id="dataPlane-consumerGroupDetails"
    >
      <Card className="kafka-ui-m-full-height">{renderConsumerTable()}</Card>
    </MASDrawer>
  );
};
