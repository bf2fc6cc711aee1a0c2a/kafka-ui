import React, { useContext, useState, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import {
  EmptyState,
  MASEmptyStateVariant,
  MASLoading,
  MASDrawer,
  usePaginationParams
} from '@app/components';
import { getConsumerGroups } from '@app/services';
import { ConfigContext } from '@app/contexts';
import { ConsumerGroupList, ConsumerGroup } from '@rhoas/kafka-instance-sdk';
import { useTimeout } from '@app/hooks/useTimeOut';
import { ISortBy, OnSort, SortByDirection } from '@patternfly/react-table';

const ConsumerGroupDetail = lazy(
  () => import('./components/ConsumerGroupDetail/ConsumerGroupDetail')
);
const ConsumerGroupsTable = lazy(
  () => import('./components/ConsumerGroupsTable/ConsumerGroupsTable')
);

export type ConsumerGroupsProps = {
  consumerGroupByTopic: boolean;
  topic?: string;
  rowDataTestId?: string;
};

const ConsumerGroups: React.FunctionComponent<ConsumerGroupsProps> = ({
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
  const [search, setSearch] = useState<string>('');
  const [consumerGroupDetail, setConsumerGroupDetail] =
    useState<ConsumerGroup>();
  const config = useContext(ConfigContext);
  const { t } = useTranslation();
  const { page = 1, perPage = 10 } = usePaginationParams() || {};

  useEffect(() => {
    setOffset(perPage * (page - 1));
  }, [page, perPage]);

  const onSort: OnSort = (_event, index, direction) => {
    setOrder(direction);
    setOrderKey('name');
    setSortBy({ index, direction });
  };

  const fetchConsumerGroups = async () => {
    const limit = 100;
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
    <ConsumerGroupDetail
      consumerGroupDetail={consumerGroupDetail}
      consumerGroupByTopic={consumerGroupByTopic}
    />
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
          className='kafka-ui-m-full-height'
          variant={PageSectionVariants.light}
          padding={{ default: 'noPadding' }}
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
            title: t('consumerGroup.empty_consumer_title'),
          }}
          emptyStateBodyProps={{
            body: t('consumerGroup.empty_consumer_body'),
          }}
        />
      );
    } else if (consumerGroups) {
      return (
        <ConsumerGroupsTable
          consumerGroups={consumerGroups?.items?.slice(
            offset,
            offset + perPage
          )}
          total={consumerGroups?.items?.length || 0}
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
    <Suspense fallback={<MASLoading />}>
      <MASDrawer
        isExpanded={isExpanded}
        onClose={onClose}
        panelBodyContent={panelBodyContent}
        drawerHeaderProps={{
          text: { label: t('consumerGroup.consumer_group_id') },
          title: { value: consumerGroupDetail?.groupId, headingLevel: 'h1' },
        }}
        data-ouia-app-id='dataPlane-consumerGroupDetails'
        refreshConsumerGroups={fetchConsumerGroups}
        consumerGroupDetail={consumerGroupDetail}
      >
        {renderConsumerTable()}
      </MASDrawer>
    </Suspense>
  );
};

export { ConsumerGroups };
export default ConsumerGroups;
