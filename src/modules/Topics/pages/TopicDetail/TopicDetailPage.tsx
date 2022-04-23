import {
  createRef,
  useCallback,
  useContext,
  useEffect,
  useState,
  VoidFunctionComponent,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertVariant,
  PageSection,
  PageSectionVariants,
  Tab,
  TabContent,
  Tabs,
  TabsProps,
  TabTitleText,
} from '@patternfly/react-core';
import {
  TopicDetailHead,
  TopicDetailView,
} from '@app/modules/Topics/components';
import { getTopicDetail } from '@app/services';
import { ConfigContext, useFederated } from '@app/contexts';
import { ConsumerGroups } from '@app/modules/ConsumerGroups';
import { isAxiosError } from '@app/utils/axios';
import { IAdvancedTopic } from '@app/modules/Topics/utils';
import {
  useAlert,
  useBasename,
  ModalType,
  useModal,
} from '@rhoas/app-services-ui-shared';
import '../style.css';
import {
  KafkaMessageBrowser,
  KafkaMessageBrowserProps,
} from '@rhoas/app-services-ui-components';
import {
  Configuration,
  RecordsApi,
  TopicsApi,
} from '@rhoas/kafka-instance-sdk';
import { Loading } from '@app/components';

export const TopicDetailPage: VoidFunctionComponent = () => {
  const { kafkaName, kafkaPageLink, kafkaInstanceLink, showSchemas } =
    useFederated() || {};

  const { topicName } = useParams<{ topicName: string }>();
  const [activeTabKey, setActiveTabKey] = useState(1);
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const contentRefMessages = createRef<HTMLElement>();
  const contentRefConsumerGroup = createRef<HTMLElement>();
  const contentRefProperties = createRef<HTMLElement>();
  const contentRefSchemas = createRef<HTMLElement>();

  const handleTabClick: TabsProps['onSelect'] = (_, tabIndex) => {
    setActiveTabKey(tabIndex as number);
  };

  return (
    <>
      <TopicDetailHead
        topicName={topicName}
        kafkaName={kafkaName}
        kafkaPageLink={kafkaPageLink}
        kafkaInstanceLink={kafkaInstanceLink}
      />
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
        className='pf-c-page__main-tabs'
      >
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          isBox={false}
          className='pf-m-page-insets'
        >
          <Tab
            eventKey={1}
            data-testid='pageTopic-tabConsumers'
            title={
              <TabTitleText>{t('consumerGroup.consumer_groups')}</TabTitleText>
            }
            tabContentId='kafka-ui-TabcontentConsumerGroupList'
            tabContentRef={contentRefConsumerGroup}
          />
          <Tab
            eventKey={2}
            data-testid='pageTopic-tabMessages'
            title={<TabTitleText>{t('topic.messages')}</TabTitleText>}
            tabContentId='kafka-ui-TabcontentMessages'
            tabContentRef={contentRefMessages}
          />
          <Tab
            eventKey={3}
            title={<TabTitleText>{t('common.properties')}</TabTitleText>}
            data-testid='pageTopic-tabProperties'
            tabContentId='kafka-ui-TabcontentProperties'
            tabContentRef={contentRefProperties}
          />
          <Tab
            eventKey={4}
            title={<TabTitleText>{t('common.schemas')}</TabTitleText>}
            data-testid='pageTopic-tabSchemas'
            tabContentId='kafka-ui-TabSchemas'
            tabContentRef={contentRefSchemas}
          />
        </Tabs>
      </PageSection>
      <PageSection
        variant={
          activeTabKey === 3
            ? PageSectionVariants.light
            : PageSectionVariants.default
        }
      >
        <TabContent
          eventKey={1}
          id='kafka-ui-TabcontentConsumerGroupList'
          ref={contentRefConsumerGroup}
          className='kafka-ui-m-full-height'
          aria-label='Consumer groups'
          hidden={activeTabKey != 1}
        >
          {activeTabKey === 1 && (
            <ConsumerGroups
              consumerGroupByTopic={true}
              topic={topicName}
              rowDataTestId='tableTopicConsumers-row'
            />
          )}
        </TabContent>
        <TabContent
          eventKey={2}
          id='kafka-ui-TabcontentMessages'
          ref={contentRefMessages}
          className='kafka-ui-m-full-height'
          aria-label='Messages'
          hidden={activeTabKey != 2}
        >
          {activeTabKey === 2 && <MessagesConnected topicName={topicName} />}
        </TabContent>
        <TabContent
          eventKey={3}
          id='kafka-ui-TabcontentProperties'
          ref={contentRefProperties}
          className='kafka-ui-m-full-height'
          aria-label='Topic properties'
          hidden={activeTabKey != 3}
        >
          {activeTabKey === 3 && (
            <TopicDetailsViewConnected topicName={topicName} />
          )}
        </TabContent>
        <TabContent
          eventKey={4}
          id='kafka-ui-TabSchemas'
          ref={contentRefSchemas}
          className='kafka-ui-m-full-height'
          aria-label='Schemas mapping'
          hidden={activeTabKey != 4}
        >
          {activeTabKey === 4 && showSchemas}
        </TabContent>
      </PageSection>
    </>
  );
};

const TopicDetailsViewConnected: VoidFunctionComponent<{
  topicName: string;
}> = ({ topicName }) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const { showModal } = useModal<ModalType.KafkaDeleteTopic>();
  const config = useContext(ConfigContext);
  const { addAlert } = useAlert() || {
    addAlert: () => {
      // No-op
    },
  };
  const { getBasename } = useBasename() || { getBasename: () => '' };
  const history = useHistory();
  const basename = getBasename();
  const { onError } = useFederated() || {};

  const [topicDetail, setTopicDetail] = useState<IAdvancedTopic>();

  const onDeleteTopic = () => {
    //Redirect on topics  viewpage after delete topic successfuly
    history.push(`${basename}/topics`);
  };

  const fetchTopicDetail = useCallback(
    async (topicName: string) => {
      try {
        await getTopicDetail(topicName, config).then((response) => {
          setTopicDetail(response);
        });
      } catch (err) {
        if (isAxiosError(err)) {
          if (onError) {
            onError(
              err.response?.data.code || -1,
              err.response?.data.error_message
            );
          }
          if (err.response?.status === 404) {
            // then it's a non-existent topic
            addAlert({
              title: t('topic.topic_not_found', { name: topicName }),
              variant: AlertVariant.danger,
            });
          }
        }
      }
    },
    [addAlert, config, onError, t]
  );

  // Make the get request
  useEffect(() => {
    fetchTopicDetail(topicName);
  }, [fetchTopicDetail, topicName]);

  const deleteTopic = () => {
    showModal(ModalType.KafkaDeleteTopic, {
      topicName,
      onDeleteTopic,
    });
  };

  return topicDetail ? (
    <TopicDetailView topic={topicDetail} deleteTopic={deleteTopic} />
  ) : (
    <Loading />
  );
};

export type Unpromise<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

const MessagesConnected: VoidFunctionComponent<{
  topicName: string;
}> = ({ topicName }) => {
  const config = useContext(ConfigContext);

  const consumeRecords = useCallback(
    async ({
      offset,
      partition,
      limit,
      timestamp,
    }: Parameters<KafkaMessageBrowserProps['getMessages']>[0]): Promise<
      Unpromise<ReturnType<KafkaMessageBrowserProps['getMessages']>>['messages']
    > => {
      const accessToken = await config?.getToken();
      const recordsApi = new RecordsApi(
        new Configuration({
          accessToken,
          basePath: config?.basePath,
        })
      );
      const { data } = await recordsApi.consumeRecords(
        topicName,
        undefined,
        limit,
        offset,
        partition,
        timestamp
      );
      return data.items.map((m) => ({
        partition: m.partition,
        offset: m.offset,
        timestamp: m.timestamp,
        key: m.key,
        value: m.value,
        headers: m.headers || {},
      }));
    },
    [config, topicName]
  );

  const getTopicPartitions = useCallback(async () => {
    const accessToken = await config?.getToken();
    const topicsApi = new TopicsApi(
      new Configuration({
        accessToken,
        basePath: config?.basePath,
      })
    );
    const { data } = await topicsApi.getTopic(topicName);
    return data.partitions?.length || 0;
  }, [config, topicName]);

  const getMessages: KafkaMessageBrowserProps['getMessages'] = useCallback(
    async (opts) => {
      const [messages, partitions] = await Promise.all([
        consumeRecords(opts),
        getTopicPartitions(),
      ]);
      return {
        partitions,
        messages,
      };
    },
    [consumeRecords, getTopicPartitions]
  );

  return <KafkaMessageBrowser getMessages={getMessages} />;
};
