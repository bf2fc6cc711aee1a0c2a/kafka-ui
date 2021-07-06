import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertVariant,
  Card,
  PageSectionVariants,
  PageSection,
} from '@patternfly/react-core';
import { useTimeout } from '@app/hooks/useTimeOut';
import { TopicsTable } from './components';
import { EmptyState, MASEmptyStateVariant, MASLoading } from '@app/components';
import { getTopics } from '@app/services';
import { ConfigContext, useFederated } from '@app/contexts';
import { TopicsList, Topic } from '@rhoas/kafka-instance-sdk';
import { KafkaActions } from '@app/utils';
import { useAlert } from '@bf2/ui-shared';
import './Topics.css';

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
  onEditTopic?: (topicName?: string | undefined) => void;
};

export const Topics: React.FC<TopicsProps> = ({
  onCreateTopic,
  onEditTopic,
}) => {
  const { dispatchKafkaAction, onError } = useFederated();
  const { t } = useTranslation();
  const { addAlert } = useAlert();
  const config = useContext(ConfigContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get('page') || '', 10) || 1;
  const perPage = parseInt(searchParams.get('perPage') || '', 10) || 10;

  const [topics, setTopics] = useState<TopicsList>();
  const [topicItems, setTopicItems] = useState<Topic[]>();
  const [searchTopicName, setSearchTopicName] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    fetchTopic();
  }, [searchTopicName]);

  useTimeout(() => fetchTopic(), 5000);

  useEffect(() => {
    const offset = Number(perPage) * Number(page - 1);
    setOffset(offset);
  }, [page, perPage]);

  const onClickCreateTopic = () => {
    onCreateTopic && onCreateTopic();
    dispatchKafkaAction && dispatchKafkaAction(KafkaActions.CreateTopic);
  };

  const fetchTopic = async () => {
    try {
      await getTopics(config, 100, perPage, searchTopicName, offset).then(
        (response) => {
          setTopics(response);
          setTopicItems(response?.items);
        }
      );
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
          onCreateTopic={onCreateTopic}
          topicItems={
            searchTopicName
              ? topicItems?.slice(0, perPage)
              : topicItems?.slice(offset, offset + perPage)
          }
          filteredValue={searchTopicName}
          setFilteredValue={setSearchTopicName}
          refreshTopics={fetchTopic}
          onEdit={onEditTopic}
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
