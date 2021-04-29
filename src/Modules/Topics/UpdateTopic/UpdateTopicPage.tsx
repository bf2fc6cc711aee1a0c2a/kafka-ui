import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  TabTitleText,
  PageSection,
  PageSectionVariants,
  TabContent,
} from '@patternfly/react-core';
import { ConsumerGroupsList } from '../../ConsumerGroups/ConsumerGroupList/Components/ConsumerGroupList';
import { UpdateTopicView } from './Components/UpdateTopicView';
import { TopicDetailHead } from '../TopicDetails/Components/TopicDetailHead';
import { useTranslation } from 'react-i18next';

export interface UpdateTopicPageProps {
  topicName: string;
  kafkaName?: string;
  kafkaPageLink?: string;
  kafkaInstanceLink?: string;
  onCancelUpdateTopic: () => void;
  onDeleteTopic: () => void;
  onSaveTopic: () => void;
  onDeleteConsumer: () => void;
  onError?: (errorCode: number, message: string) => void;
  activeTab?: number;
}

export const UpdateTopicPage: React.FunctionComponent<UpdateTopicPageProps> = ({
  topicName,
  kafkaName,
  kafkaPageLink,
  kafkaInstanceLink,
  onCancelUpdateTopic,
  onDeleteTopic,
  onSaveTopic,
  onError,
  onDeleteConsumer,
  activeTab = 0,
}) => {
  const { t } = useTranslation();

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
        className='pf-c-page__main-tabs'
        padding={{ default: 'noPadding' }}
      >
        <Tabs
          onSelect={handleTabClick}
          activeKey={activeTabKey}
          isBox={false}
          className='pf-m-page-insets'
        >
          <Tab
            eventKey={0}
            title={
              <TabTitleText>{t('consumerGroup.consumer_groups')}</TabTitleText>
            }
          >
            <ConsumerGroupsList
              onDeleteConsumerGroup={onDeleteConsumer}
              topic={topicName}
              consumerGroupByTopic={true}
            />
          </Tab>
          <Tab
            eventKey={1}
            title={<TabTitleText>{t('common.properties')}</TabTitleText>}
          >
            <PageSection variant='light' padding={{ default: 'noPadding' }}>
              <UpdateTopicView
                topicName={topicName}
                onCancelUpdateTopic={onCancelUpdateTopic}
                onDeleteTopic={onDeleteTopic}
                onSaveTopic={onSaveTopic}
                onError={onError}
              />
            </PageSection>
          </Tab>
        </Tabs>
      </PageSection>
      <PageSection
        variant={
          activeTabKey === 1
            ? PageSectionVariants.light
            : PageSectionVariants.default
        }
      >
        <TabContent
          eventKey={0}
          id='kafka-ui-TabcontentConsumerGroups'
          ref={contentRefConsumerGroup}
          className='kafka-ui-m-full-height'
          aria-label='Consumer groups.'
          hidden={activeTab !== 0 ? true : false}
        >
          <ConsumerGroupsList
            onDeleteConsumerGroup={onDeleteConsumer}
            topic={topicName}
            consumerGroupByTopic={true}
          />
        </TabContent>
        <TabContent
          eventKey={1}
          id='kafka-ui-TabcontentProperties'
          ref={contentRefProperties}
          className='kafka-ui-m-full-height'
          aria-label='Topic properties'
          hidden={activeTab !== 1 ? true : false}
        >
          <UpdateTopicView
            topicName={topicName}
            onCancelUpdateTopic={onCancelUpdateTopic}
            onDeleteTopic={onDeleteTopic}
            onSaveTopic={onSaveTopic}
            onError={onError}
          />
        </TabContent>
      </PageSection>
    </>
  );
};
