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
};

export const TopicDetailHead: React.FC<TopicDetailHeadProps> = ({
  topicName,
}) => {
  return (
    <section className='pf-c-page__main-breadcrumb'>
      <Breadcrumb>
        <BreadcrumbItem to='#/topics'>Topics</BreadcrumbItem>
        <BreadcrumbItem to={`#/topic/${topicName}`}>{topicName}</BreadcrumbItem>
      </Breadcrumb>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent className='header-padding'>
          <Text component={TextVariants.h1}>{topicName}</Text>
        </TextContent>
      </PageSection>
    </section>
  );
};
