import React, {
  useContext,
  useState,
  useEffect,
  Suspense,
  useCallback,
} from 'react';
import { MASLoading } from '@app/components';
import {
  getConsumerGroups,
  KafkaConsumerGroupSortableColumns,
} from '@app/services';
import { ConfigContext } from '@app/contexts';
import { useTimeout } from '@app/hooks/useTimeOut';
import {
  usePaginationSearchParams,
  useSortableSearchParams,
  useURLSearchParamsChips,
  ConsumerGroup,
  ConsumerGroupsTable,
  ConsumerGroupDrawer,
} from '@rhoas/app-services-ui-components';
import { ModalType, useModal } from '@rhoas/app-services-ui-shared';

export type ConsumerGroupsProps = {
  consumerGroupByTopic: boolean;
  topic?: string;
};

const ConsumerGroups: React.FunctionComponent<ConsumerGroupsProps> = ({
  consumerGroupByTopic,
  topic,
}) => {
  const [consumerGroups, setConsumerGroups] = useState<ConsumerGroup[]>();
  const [count, setCount] = useState<number>();

  const config = useContext(ConfigContext);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const [consumerGroup, setConsumerGroup] = useState<ConsumerGroup>();

  // const { showModal: showResetOffsetModal } =
  //   useModal<ModalType.KafkaConsumerGroupResetOffset>();

  const { showModal } = useModal<ModalType.KafkaDeleteConsumerGroup>();

  const { page, perPage, setPagination, setPaginationQuery } =
    usePaginationSearchParams();
  const resetPaginationQuery = useCallback(
    () => setPaginationQuery(1, perPage),
    [perPage, setPaginationQuery]
  );

  const consumerName = useURLSearchParamsChips(
    'consumer',
    resetPaginationQuery
  );
  const [isColumnSortable, sort, sortDirection] = useSortableSearchParams(
    KafkaConsumerGroupSortableColumns,
    {
      name: 'TODO name',
    },
    'name',
    'desc'
  );

  const fetchConsumerGroups = useCallback(async () => {
    await getConsumerGroups(
      config,
      page,
      perPage,
      sort!,
      sortDirection,
      topic,
      consumerName.chips[0]
    ).then(({ groups, count }) => {
      setConsumerGroups(groups);
      setCount(count);
    });
  }, [config, page, perPage, sort, sortDirection, topic, consumerName.chips]);

  useEffect(() => {
    fetchConsumerGroups();
  }, [page, perPage, sort, sortDirection, fetchConsumerGroups]);

  useTimeout(() => fetchConsumerGroups(), 5000);

  const onSelectDeleteConsumerGroup = (consumer: ConsumerGroup) => {
    showModal(ModalType.KafkaDeleteConsumerGroup, {
      consumerName: consumer.consumerGroupId,
      state: consumer.state,
    });
  };

  const onClose = () => {
    setIsExpanded(false);
  };

  const onViewConsumerGroup = (consumer: ConsumerGroup) => {
    setIsExpanded(true);
    setConsumerGroup(consumer);
  };

  return (
    <Suspense fallback={<MASLoading />}>
      <ConsumerGroupDrawer
        consumerGroupByTopic={consumerGroupByTopic}
        state={consumerGroup?.state || 'Stable'}
        activeMembers={consumerGroup?.activeMembers || 0}
        partitionsWithLag={consumerGroup?.partitionsWithLag || 0}
        consumers={consumerGroup?.consumers || []}
        groupId={consumerGroup?.consumerGroupId || ''}
        onSelectDeleteConsumerGroup={() =>
          onSelectDeleteConsumerGroup(consumerGroup)
        }
        onSelectResetOffsetConsumerGroup={() =>
          onSelectDeleteConsumerGroup(consumerGroup)
        }
        isExpanded={isExpanded}
        onClickClose={onClose}
      >
        <ConsumerGroupsTable
          consumers={consumerGroups}
          page={page}
          perPage={perPage}
          consumerName={consumerName.chips}
          isRowSelected={() => true}
          isColumnSortable={isColumnSortable}
          onDelete={(row) => onSelectDeleteConsumerGroup(row)}
          onSearchConsumer={(value) => {
            consumerName.clear();
            consumerName.toggle(value);
          }}
          onClearAllFilters={consumerName.clear}
          onPageChange={setPagination}
          onRemoveConsumerChip={consumerName.clear}
          onRemoveConsumerChips={consumerName.clear}
          onViewPartition={(row) => onViewConsumerGroup(row)}
          onViewResetOffset={(row) => {
            row;
          }}
          itemCount={count}
        />
      </ConsumerGroupDrawer>
    </Suspense>
  );
};

export { ConsumerGroups };
export default ConsumerGroups;
