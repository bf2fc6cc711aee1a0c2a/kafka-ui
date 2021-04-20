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
    <>
      <section className='pf-c-page__main-breadcrumb'>
        <Breadcrumb>
          <BreadcrumbItem to='/openshiftstreams'>
            Kafka Instances
          </BreadcrumbItem>
          <BreadcrumbItem to='/openshiftstreams'>
            Kafka Instance Name
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
