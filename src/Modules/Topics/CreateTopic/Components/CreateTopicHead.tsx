import {
  PageSection,
  PageSectionVariants,
  Title,
  Switch,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
} from '@patternfly/react-core';
import React from 'react';

export interface ICreateTopicProps {
  isSwitchChecked: boolean;
  setIsSwitchChecked: (value: boolean) => void;
}

export const CreateTopichead: React.FC<ICreateTopicProps> = ({
  isSwitchChecked,
  setIsSwitchChecked,
}) => {
  const mainBreadcrumbs = (
    <Breadcrumb>
      <BreadcrumbItem to='/openshiftstreams'>
        Red Hat OpenShift Streams for Apache Kafka
      </BreadcrumbItem>
      <BreadcrumbItem to='/openshiftstreams'>
        MK Cluster Instance
      </BreadcrumbItem>
      <BreadcrumbItem to='#' isActive>
        Create topic
      </BreadcrumbItem>
    </Breadcrumb>
  );
  return (
    <>
      <section className='pf-c-page__main-breadcrumb'>
        {mainBreadcrumbs}
      </section>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel='h1' size='2xl'>
          Create topic
        </Title>
        <br />
        <Switch
          id='simple-switch'
          label='Show all available options'
          labelOff='Show all available options'
          isChecked={isSwitchChecked}
          onChange={setIsSwitchChecked}
          className='create-topic-wizard'
        />
      </PageSection>
      <Divider />
    </>
  );
};
