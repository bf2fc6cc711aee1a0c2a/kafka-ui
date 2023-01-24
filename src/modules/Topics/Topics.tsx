import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card } from '@patternfly/react-core';
import {
  KafkaTopics,
  usePaginationSearchParams,
  useSortableSearchParams,
  useURLSearchParamsChips,
  KafkaTopic,
  useTopicLabels,
} from '@rhoas/app-services-ui-components';
import { ConfigContext, useFederated } from '@app/contexts';
import {
  ModalType,
  useBasename,
  useModal,
} from '@rhoas/app-services-ui-shared';
import './Topics.css';
import { useTimeout } from '@app/hooks';
import { getTopics, KafkaTopicsSortableColumns } from '@app/services';
import { isAxiosError } from '@app/utils/axios';

const Topics: React.FC = () => {
  const { analytics } = useChrome();
  const { kafka, onError } = useFederated() || {};

  const labels = useTopicLabels();

  const { showModal } = useModal<ModalType.KafkaDeleteTopic>();

  const config = useContext(ConfigContext);
  const history = useHistory();
  const { getBasename } = useBasename() || { getBasename: () => '' };
  const basename = getBasename();

  const [topicsList, setTopicsList] = useState<KafkaTopic[] | undefined | null>(
    null
  );

  const [count, setCount] = useState<number>();

  const { page, perPage, setPagination, setPaginationQuery } =
    usePaginationSearchParams();
  const resetPaginationQuery = useCallback(
    () => setPaginationQuery(1, perPage),
    [perPage, setPaginationQuery]
  );

  const topicsChips = useURLSearchParamsChips('topics', resetPaginationQuery);
  const [isColumnSortable, sort, sortDirection] = useSortableSearchParams(
    KafkaTopicsSortableColumns,
    labels.fields
  );

  const onClickCreateTopic = () => {
    history.push(`${basename}/topic/create`);
  };

  const onEditTopic = (topicName: string | undefined) => {
    history.push(`${basename}/topic/update/${topicName}`);
  };

  const onEdit = (topicName: string | undefined) => {
    onEditTopic && onEditTopic(topicName);
  };

  const onDelete = (topicName: string) => {
    analytics.track('RHOSAK Delete Topic', {
      entityId: kafka?.id,
      topic: topicName,
      status: 'prompt',
    });
    showModal(ModalType.KafkaDeleteTopic, {
      topicName,
      onDeleteTopic: () => {
        analytics.track('RHOSAK Delete Topic', {
          entityId: kafka?.id,
          topic: topicName,
          status: 'success',
        });
      },
    });
  };

  const fetchTopic = useCallback(async () => {
    try {
      await getTopics(
        config,
        page,
        perPage,
        sort!,
        sortDirection,
        topicsChips.chips[0]
      ).then(({ topics, count }) => {
        setTopicsList(topics);
        setCount(count);
      });
    } catch (err) {
      //TODO: Update the api to allow suppress alerts if the application does not want to show them as well.
      let message: string | undefined;
      let code: number | undefined;
      if (err && isAxiosError(err)) {
        code = err.response?.data.code;
        message = err.response?.data.error_message;
      }
      if (onError && code === 401) {
        onError(code, message);
      }
    }
  }, [config, onError, page, perPage, sort, sortDirection, topicsChips.chips]);

  useEffect(() => {
    fetchTopic();
  }, [topicsChips.chips, sort, sortDirection, page, perPage, fetchTopic]);

  useTimeout(() => fetchTopic(), 1000);

  const onClearAllFilters = useCallback(() => {
    setTopicsList(undefined);
    topicsChips.clear();
  }, [topicsChips]);

  return (
    <Card className='kafka-ui-m-full-height' data-ouia-page-id='tableTopics'>
      <KafkaTopics
        topics={topicsList}
        getUrlFortopic={(row) => `${basename}/topics/${row.name}`}
        onDelete={(row) => onDelete(row.name)}
        onEdit={(row) => onEdit(row.name)}
        onSearchTopic={(value) => {
          topicsChips.clear();
          topicsChips.toggle(value);
        }}
        onClearAllFilters={onClearAllFilters}
        topicName={topicsChips.chips}
        onRemoveTopicChip={topicsChips.clear}
        onRemoveTopicChips={topicsChips.clear}
        onTopicLinkClick={(row) => {
          row.name;
        }}
        page={page}
        perPage={perPage}
        itemCount={count}
        onPageChange={setPagination}
        onCreateTopic={onClickCreateTopic}
        isColumnSortable={isColumnSortable}
      />
    </Card>
  );
};

export { Topics };
export default Topics;
