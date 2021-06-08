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

export type TopicDetailHeadProps = {
  topicName: string;
  kafkaName?: string;
  kafkaInstanceLink?: string;
  kafkaPageLink?: string;
  updateTopic?: boolean;
  setExitFormModal?: (value: boolean) => void;
};

export const TopicDetailHead: React.FC<TopicDetailHeadProps> = ({
  topicName,
  kafkaName,
  kafkaInstanceLink,
  kafkaPageLink,
  updateTopic,
  setExitFormModal,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <section className='pf-c-page__main-breadcrumb'>
        <Breadcrumb>
          <BreadcrumbItem
            onClick={() =>
              updateTopic && setExitFormModal && setExitFormModal(true)
            }
            to={
              updateTopic ? kafkaPageLink || `#/topic/update/${topicName}` : '#'
            }
          >
            {t('common.kafka_instance')}
          </BreadcrumbItem>
          <BreadcrumbItem
            onClick={() =>
              updateTopic && setExitFormModal && setExitFormModal(true)
            }
            to={
              updateTopic
                ? kafkaInstanceLink || `#/topic/update/${topicName}`
                : '#'
            }
          >
            {kafkaName ? kafkaName : t('common.kafka_instance_name')}
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
