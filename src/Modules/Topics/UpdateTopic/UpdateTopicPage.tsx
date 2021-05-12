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
  const [activeTabKey, setActiveTabKey] = useState(activeTab);

  const contentRefConsumerGroup = React.createRef<HTMLElement>();
  const contentRefProperties = React.createRef<HTMLElement>();

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
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
            title={<TabTitleText>Consumer groups</TabTitleText>}
            tabContentId='kafka-ui-TabcontentConsumerGroups'
            tabContentRef={contentRefConsumerGroup}
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>Properties</TabTitleText>}
            tabContentId='kafka-ui-TabcontentProperties'
            tabContentRef={contentRefProperties}
          />
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
          hidden
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
