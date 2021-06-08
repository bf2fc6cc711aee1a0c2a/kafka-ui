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
  setKafkaPageLinkRedirect?: (value: boolean) => void;
};

export const TopicDetailHead: React.FC<TopicDetailHeadProps> = ({
  topicName,
  kafkaName,
  kafkaPageLink,
  updateTopic,
  setExitFormModal,
  setKafkaPageLinkRedirect,
}) => {
  const { t } = useTranslation();

  const kafkaInstanceBreadcrumbClick = () => {
    if (updateTopic) {
      setExitFormModal && setExitFormModal(true);
      setKafkaPageLinkRedirect && setKafkaPageLinkRedirect(true);
    }
  };

  return (
    <>
      <section className='pf-c-page__main-breadcrumb'>
        <Breadcrumb>
          <BreadcrumbItem
            onClick={kafkaInstanceBreadcrumbClick}
            to={
              updateTopic
                ? `#/topic/update/${topicName}`
                : kafkaPageLink
                ? kafkaPageLink
                : '#'
            }
          >
            {t('common.kafka_instance')}
          </BreadcrumbItem>
          <BreadcrumbItem
            onClick={() =>
              updateTopic && setExitFormModal && setExitFormModal(true)
            }
            to={updateTopic ? `#/topic/update/${topicName}` : '#'}
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
