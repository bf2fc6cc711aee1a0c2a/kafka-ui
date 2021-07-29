import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertVariant,
  Card,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
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
import { Topic } from '@rhoas/kafka-instance-sdk';
import { useAlert, useBasename } from '@bf2/ui-shared';
import './Topics.css';
import { ISortBy, OnSort, SortByDirection } from '@patternfly/react-table';

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
  const { t } = useTranslation();
  const { addAlert } = useAlert() || {
    addAlert: () => {
      // No-op
    },
  };
  const config = useContext(ConfigContext);
  const { page = 1, perPage = 10 } = usePaginationParams() || {};
  const history = useHistory();
  const { getBasename } = useBasename() || { getBasename: () => '' };
  const basename = getBasename();

  const [topicItems, setTopicItems] = useState<Topic[]>();
  const [searchTopicName, setSearchTopicName] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [order, setOrder] = useState<SortByDirection>();
  const [orderKey, setOrderKey] = useState<OrderKey>();
  const [sortBy, setSortBy] = useState<ISortBy>({ index: 0, direction: 'asc' });

  useEffect(() => {
    fetchTopic();
  }, [searchTopicName, order, orderKey]);

  useTimeout(() => fetchTopic(), 5000);

  useEffect(() => {
    const offset = perPage * (page - 1);
    setOffset(offset);
  }, [page, perPage]);

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
        100,
        perPage,
        searchTopicName,
        offset,
        order,
        orderKey
      ).then((response) => {
        setTopicItems(response?.items);
      });
    } catch (err) {
      //TODO: Update the api to allow suppress alerts if the application does not want to show them as well.
      if (onError && err.response.data.code === 401) {
        onError(err.response.data.code, err.response.data.error_message);
      } else {
        addAlert({
          title: err.response.data.error_message,
          variant: AlertVariant.danger,
        });
      }
    }
  };

  const renderTopicsTable = () => {
    if (topicItems === undefined) {
      return (
        <PageSection
          className='kafka-ui-m-full-height'
          variant={PageSectionVariants.light}
          padding={{ default: 'noPadding' }}
        >
          <MASLoading />
        </PageSection>
      );
    } else if (topicItems.length < 1 && searchTopicName.length < 1) {
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
    } else if (topicItems) {
      return (
        <TopicsTable
          total={topicItems.length || 0}
          page={page}
          perPage={perPage}
          onCreateTopic={onClickCreateTopic}
          topicItems={
            searchTopicName
              ? topicItems?.slice(0, perPage)
              : topicItems?.slice(offset, offset + perPage)
          }
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
