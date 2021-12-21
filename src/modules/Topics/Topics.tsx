import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { useTimeout } from '@app/hooks/useTimeOut';
import { TopicsTable } from './components';
import {
  EmptyState,
  MASEmptyStateVariant,
  MASLoading,
  usePaginationParams,
} from '@app/components';
import { getTopics, OrderKey } from '@app/services';
import { ConfigContext, useFederated } from '@app/contexts';
import { TopicsList } from '@rhoas/kafka-instance-sdk';
import { useBasename } from '@rhoas/app-services-ui-shared';
import './Topics.css';
import { ISortBy, OnSort, SortByDirection } from '@patternfly/react-table';
import { isAxiosError } from '@app/utils/axios';

export type ITopic = {
  name: string;
  replicas: number;
  partitions: number;
};

export type ITopicProps = {
  rows: ITopic[];
};

const Topics: React.FC = () => {
  const { onError } = useFederated() || {};
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  const config = useContext(ConfigContext);
  const { page = 1, perPage = 10 } = usePaginationParams() || {};
  const history = useHistory();
  const { getBasename } = useBasename() || { getBasename: () => '' };
  const basename = getBasename();

  const [topicsList, setTopicsList] = useState<TopicsList>();
  const [searchTopicName, setSearchTopicName] = useState<string>('');
  const [order, setOrder] = useState<SortByDirection>();
  const [orderKey, setOrderKey] = useState<OrderKey>();
  const [sortBy, setSortBy] = useState<ISortBy>({ index: 0, direction: 'asc' });

  useEffect(() => {
    fetchTopic();
  }, [searchTopicName, order, orderKey, page, perPage]);

  useTimeout(() => fetchTopic(), 5000);

  const onClickCreateTopic = () => {
    history.push(`${basename}/topic/create`);
  };

  const onEditTopic = (topicName: string | undefined) => {
    history.push(`${basename}/topic/update/${topicName}`);
  };

  const onEdit = (topicName: string | undefined) => {
    onEditTopic && onEditTopic(topicName);
  };

  const onSort: OnSort = (_event, index, direction) => {
    const sortableCols = {
      '0': 'name',
      '1': 'partitions',
      '2': 'retention.ms',
      '3': 'retention.bytes',
    };

    setOrderKey(sortableCols[index]);
    setOrder(direction);
    setSortBy({ index, direction });
  };

  const fetchTopic = async () => {
    try {
      await getTopics(
        config,
        page,
        perPage,
        searchTopicName,
        order,
        orderKey
      ).then((topics) => {
        setTopicsList(topics);
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
  };

  const renderTopicsTable = () => {
    if (topicsList?.items === undefined) {
      return (
        <PageSection
          className='kafka-ui-m-full-height'
          variant={PageSectionVariants.light}
          padding={{ default: 'noPadding' }}
        >
          <MASLoading />
        </PageSection>
      );
    } else if (topicsList?.items?.length < 1 && searchTopicName.length < 1) {
      return (
        <EmptyState
          emptyStateProps={{
            variant: MASEmptyStateVariant.NoItems,
            'data-ouia-page-id': 'emptyStateTopics',
          }}
          titleProps={{
            title: t('topic.empty_topics_title'),
          }}
          emptyStateBodyProps={{
            body: t('topic.empty_topics_body'),
          }}
          buttonProps={{
            title: t('topic.create_topic'),
            onClick: onClickCreateTopic,
            'data-testid': 'actionCreateTopic',
          }}
        />
      );
    } else if (topicsList?.items) {
      return (
        <TopicsTable
          total={topicsList?.total || 0}
          page={page}
          perPage={perPage}
          onCreateTopic={onClickCreateTopic}
          topicItems={topicsList?.items}
          filteredValue={searchTopicName}
          setFilteredValue={setSearchTopicName}
          refreshTopics={fetchTopic}
          onEdit={onEdit}
          onSort={onSort}
          sortBy={sortBy}
        />
      );
    }
    return <></>;
  };

  return (
    <>
      <Card className='kafka-ui-m-full-height' data-ouia-page-id='tableTopics'>
        {renderTopicsTable()}
      </Card>
    </>
  );
};

export { Topics };
export default Topics;
