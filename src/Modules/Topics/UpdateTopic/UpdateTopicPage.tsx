import React from 'react';
import {
  Tabs,
  Tab,
  TabTitleText,
  PageSection,
  PageSectionVariants,
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
        padding={{ default: 'noPadding' }}
      >
        <Tabs
          activeKey={1}
          onSelect={() => {
            return;
          }}
          isBox={false}
          className='kafka-ui--tab-padding'
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>{t('consumerGroups.consumerGroups')}</TabTitleText>}
          >
            <ConsumerGroupsList
              onDeleteConsumerGroup={onDeleteConsumer}
              topic={topicName}
              consumerGroupByTopic={true}
            />
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>{t('common.properties')}</TabTitleText>}>
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
    </>
  );
};
