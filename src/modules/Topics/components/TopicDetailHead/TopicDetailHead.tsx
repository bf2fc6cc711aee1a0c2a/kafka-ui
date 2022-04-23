import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  BreadcrumbItem,
  TextContent,
  Text,
  TextVariants,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import '../TopicDetailView/TopicDetailView.css';
import { Link } from 'react-router-dom';

export type TopicDetailHeadProps = {
  topicName: string;
  kafkaName?: string;
  kafkaInstanceLink?: string;
  kafkaPageLink?: string;
};

export const TopicDetailHead: React.FC<TopicDetailHeadProps> = ({
  topicName,
  kafkaName,
  kafkaInstanceLink,
  kafkaPageLink,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  return (
    <>
      <section className='pf-c-page__main-breadcrumb'>
        <Breadcrumb>
          <BreadcrumbItem
            render={() => (
              <Link to={kafkaPageLink || '#'}>
                {t('common.kafka_instance')}
              </Link>
            )}
          />
          <BreadcrumbItem
            render={() => (
              <Link to={kafkaInstanceLink || '#'}>
                {kafkaName || t('common.kafka_instance_name')}
              </Link>
            )}
          />
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
