import {
  Breadcrumb,
  BreadcrumbItem,
  TextContent,
  Text,
  TextVariants,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import React from 'react';
import './TopicDetailView.css';

export type TopicDetailHeadProps = {
  topicName: string;
  getTopicListPath: () => string;
  onClickTopicList: () => void;
};

export const TopicDetailHead: React.FC<TopicDetailHeadProps> = ({
  topicName,
  getTopicListPath,
  onClickTopicList,
}) => {
  return (
    <section className='pf-c-page__main-breadcrumb'>
      <Breadcrumb>
        <BreadcrumbItem
          onClick={(e) => {
            e.preventDefault();
            onClickTopicList();
          }}
          to={getTopicListPath()}
        >
          Topics
        </BreadcrumbItem>
        <BreadcrumbItem>{topicName}</BreadcrumbItem>
      </Breadcrumb>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent className='header-padding'>
          <Text component={TextVariants.h1}>{topicName}</Text>
        </TextContent>
      </PageSection>
    </section>
  );
};
