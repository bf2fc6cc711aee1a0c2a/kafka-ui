import React, {
  useContext,
  useState,
  useEffect,
  lazy,
  Suspense,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import {
  EmptyState,
  MASEmptyStateVariant,
  MASLoading,
  MASDrawer,
  usePaginationParams,
} from '@app/components';
import { getConsumerGroups } from '@app/services';
import { ConfigContext } from '@app/contexts';
import { ConsumerGroupList, ConsumerGroup } from '@rhoas/kafka-instance-sdk';
import { useTimeout } from '@app/hooks/useTimeOut';
import { ISortBy, OnSort, SortByDirection } from '@patternfly/react-table';
import { ConsumerGroupsTableProps } from '@app/modules/ConsumerGroups/components';

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
  const [groupId, setGroupId] = useState<string>();

  const config = useContext(ConfigContext);
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const { page = 1, perPage = 10, setPage } = usePaginationParams() || {};

  const onSearch = useCallback(
    (value: string) => {
      setSearch(value);
      setPage && setPage(1);
    },
    [setPage]
  );

  const onSort: OnSort = (_event, index, direction) => {
    setOrder(direction);
    setOrderKey('name');
    setSortBy({ index, direction });
  };

  const fetchConsumerGroups = useCallback(async () => {
    await getConsumerGroups(
      config,
      perPage,
      page,
      topic,
      search,
      order,
      orderKey
    ).then((response) => {
      setConsumerGroups(response);
    });
  }, [config, order, orderKey, page, perPage, search, topic]);

  useEffect(() => {
    fetchConsumerGroups();
  }, [search, order, page, perPage, fetchConsumerGroups]);

  useEffect(() => {
    //update setConsumerGroupDetail state after reset offset value
    //so that values will update on page
    const filteredGroup =
      consumerGroups &&
      consumerGroups.items?.find((g) => g.groupId === groupId);
    if (filteredGroup) setConsumerGroupDetail(filteredGroup);
  }, [consumerGroups, groupId]);

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

  const onViewConsumerGroup: ConsumerGroupsTableProps['onViewConsumerGroup'] = (
    consumerGroup
  ) => {
    setIsExpanded(true);
    setGroupId(consumerGroup?.groupId);
    setConsumerGroupDetail(consumerGroup);
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
        {(() => {
          switch (true) {
            case consumerGroups === undefined:
              return (
                <PageSection
                  className='kafka-ui-m-full-height'
                  variant={PageSectionVariants.light}
                  padding={{ default: 'noPadding' }}
                >
                  <MASLoading />
                </PageSection>
              );
            case (!consumerGroups?.items?.length ||
              consumerGroups?.items?.length < 1) &&
              search.length < 1:
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
            case consumerGroups?.items !== undefined:
              return (
                <ConsumerGroupsTable
                  consumerGroups={consumerGroups?.items}
                  total={consumerGroups?.total || 0}
                  page={page}
                  perPage={perPage}
                  search={search}
                  setSearch={onSearch}
                  rowDataTestId={rowDataTestId}
                  onViewConsumerGroup={onViewConsumerGroup}
                  isDrawerOpen={isExpanded}
                  refreshConsumerGroups={fetchConsumerGroups}
                  onSort={onSort}
                  sortBy={sortBy}
                />
              );
            default:
              return <></>;
          }
        })()}
      </MASDrawer>
    </Suspense>
  );
};

export { ConsumerGroups };
export default ConsumerGroups;
