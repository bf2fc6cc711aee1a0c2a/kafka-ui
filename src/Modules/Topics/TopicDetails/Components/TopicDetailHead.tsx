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
  kafkaName?: string,
  kafkaInstanceLink?: string,
  kafkaPageLink?: string,
};

export const TopicDetailHead: React.FC<TopicDetailHeadProps> = ({
  topicName,
  kafkaName,
  kafkaInstanceLink,
  kafkaPageLink
}) => {
  return (
    <>
      <section className='pf-c-page__main-breadcrumb'>
        <Breadcrumb>
          <BreadcrumbItem to={kafkaPageLink ? kafkaPageLink : '#'}>
            Kafka Instances
          </BreadcrumbItem>
          <BreadcrumbItem to={kafkaInstanceLink ? kafkaInstanceLink : '#'}>
            {kafkaName ? kafkaName : 'Kafka Instance Name'}
          </BreadcrumbItem>
          <BreadcrumbItem>{topicName}</BreadcrumbItem>
        </Breadcrumb>
      </section>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component={TextVariants.h1}>{topicName}</Text>
        </TextContent>
      </PageSection>
    </>
  );
};
