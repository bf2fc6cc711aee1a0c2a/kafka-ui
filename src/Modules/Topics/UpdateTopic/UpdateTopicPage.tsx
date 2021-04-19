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
import { useHistory } from 'react-router';

export interface UpdateTopicPageProps {
  topicName: string;
  getTopicListPath: () => string;
  onClickTopicList: () => void;
  onCancelUpdateTopic: () => void;
  onDeleteTopic: () => void;
  onSaveTopic: () => void;
  onError?: (errorCode: number, message: string) => void;
}

export const UpdateTopicPage: React.FunctionComponent<UpdateTopicPageProps> = ({
  topicName,
  getTopicListPath,
  onClickTopicList,
  onCancelUpdateTopic,
  onDeleteTopic,
  onSaveTopic,
  onError,
}) => {
  const history = useHistory();

  const onDeleteConsumer = () => {
    history.push('/consumerGroups');
  };
  return (
    <>
      <TopicDetailHead
        topicName={topicName}
        getTopicListPath={getTopicListPath}
        onClickTopicList={onClickTopicList}
      />
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
      >
        {/* <div> */}
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
            title={<TabTitleText>Consumer Groups</TabTitleText>}
          >
            <ConsumerGroupsList
              onDeleteConsumerGroup={onDeleteConsumer}
              topic={topicName}
              consumerGroupByTopic={true}
            />
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Properties</TabTitleText>}>
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
