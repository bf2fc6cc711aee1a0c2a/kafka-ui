import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
import {
  EmptyState,
  MASEmptyStateVariant,
  MASLoading,
  MASDrawer,
} from '@app/components';
import { getConsumerGroups } from '@app/services';
import { ConfigContext } from '@app/contexts';
import { ConsumerGroupList, ConsumerGroup } from '@rhoas/kafka-instance-sdk';
import { useTimeout } from '@app/hooks/useTimeOut';
import { ConsumerGroupDetail, ConsumerGroupsTable } from './components';
import { ISortBy, OnSort, SortByDirection } from '@patternfly/react-table';

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
  const [order, setOrder] = useState<SortByDirection>();
  const [orderKey, setOrderKey] = useState<'name' | undefined>();
  const [sortBy, setSortBy] = useState<ISortBy>({
    index: undefined,
    direction: 'asc',
  });
  const [consumerGroups, setConsumerGroups] = useState<ConsumerGroupList>();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [consumerGroupDetail, setConsumerGroupDetail] =
    useState<ConsumerGroup>();
  const [filteredConsumerGroups, setFilteredConsumerGroups] =
    useState<ConsumerGroupList>();

  const config = useContext(ConfigContext);
  const { t } = useTranslation();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get("page") || "", 10) || 1;
  const perPage = parseInt(searchParams.get("perPage") || "", 10) || 10;

  useEffect(() => {
    setOffset(perPage * (page - 1));
  }, [page, perPage]);

  const onSort: OnSort = (_event, index, direction) => {
    setOrder(direction);
    setOrderKey('name');
    setSortBy({ index, direction });
  };

  const fetchConsumerGroups = async () => {
    let limit = 100;
    try {
      await getConsumerGroups(
        config,
        offset,
        limit,
        perPage,
        page,
        topic,
        search,
        order,
        orderKey
      ).then((response) => {
        setConsumerGroups(response);
      });
    } catch (err) {
      //addAlert(err.response.data.error_message, AlertVariant.danger);
    }
  };

  useEffect(() => {
    fetchConsumerGroups();
  }, [search, order]);

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
      (!consumerGroups?.items?.length || consumerGroups?.items?.length < 1) &&
      search.length < 1
    ) {
      return (
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
      );
    } else if (filteredConsumerGroups) {
      return (
        <ConsumerGroupsTable
          consumerGroups={filteredConsumerGroups?.items?.slice(
            offset,
            offset + perPage
          )}
          total={filteredConsumerGroups?.items?.length || 0}
          page={page}
          perPage={perPage}
          search={search}
          setSearch={setSearch}
          rowDataTestId={rowDataTestId}
          onViewConsumerGroup={onViewConsumerGroup}
          isDrawerOpen={isExpanded}
          refreshConsumerGroups={fetchConsumerGroups}
          consumerGroupByTopic={consumerGroupByTopic}
          onSort={onSort}
          sortBy={sortBy}
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
      {renderConsumerTable()}
    </MASDrawer>
  );
};
