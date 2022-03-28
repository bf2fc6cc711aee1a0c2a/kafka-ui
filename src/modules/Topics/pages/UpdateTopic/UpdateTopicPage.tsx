import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBasename } from '@rhoas/app-services-ui-shared';
import {
  Tabs,
  Tab,
  TabTitleText,
  PageSection,
  PageSectionVariants,
  TabContent,
  TabsProps,
} from '@patternfly/react-core';
import { ConsumerGroups } from '@app/modules/ConsumerGroups';
import {
  UpdateTopicView,
  TopicDetailHead,
} from '@app/modules/Topics/components';
import { useFederated } from '@app/contexts';
import '../style.css';

export const UpdateTopicPage: React.FunctionComponent = () => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const history = useHistory();
  const { getBasename } = useBasename() || { getBasename: () => '' };
  const basename = getBasename();
  const { topicName } = useParams<{ topicName: string }>();
  const {
    kafkaName,
    kafkaPageLink,
    kafkaInstanceLink,
    onError,
    activeTab = 1,
  } = useFederated() || {};
  const [activeTabKey, setActiveTabKey] = useState(activeTab);

  const contentRefConsumerGroup = React.createRef<HTMLElement>();
  const contentRefProperties = React.createRef<HTMLElement>();

  const onDeleteTopic = () => {
    history.push(basename);
  };

  const onSaveTopic = () => {
    history.push(`${basename}/topics/${topicName}`);
  };

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
            tabContentId='kafka-ui-TabcontentConsumerGroups'
            tabContentRef={contentRefConsumerGroup}
          ></Tab>
          <Tab
            eventKey={1}
            title={<TabTitleText>{t('common.properties')}</TabTitleText>}
            tabContentId='kafka-ui-TabcontentProperties'
            tabContentRef={contentRefProperties}
          ></Tab>
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
          hidden={activeTab !== 0}
        >
          <ConsumerGroups topic={topicName} consumerGroupByTopic={true} />
        </TabContent>
        <TabContent
          eventKey={1}
          id='kafka-ui-TabcontentProperties'
          ref={contentRefProperties}
          className='kafka-ui-m-full-height'
          aria-label='Topic properties'
          hidden={activeTab !== 1}
        >
          <UpdateTopicView
            topicName={topicName}
            onDeleteTopic={onDeleteTopic}
            onSaveTopic={onSaveTopic}
            onError={onError}
          />
        </TabContent>
      </PageSection>
    </>
  );
};
