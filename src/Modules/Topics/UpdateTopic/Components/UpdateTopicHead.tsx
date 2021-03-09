import React from 'react';
import { Title, Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

export interface IUpdateTopicHeadProps {
  topicName: string;
}

export const UpdateTopicHead: React.FC<IUpdateTopicHeadProps> = ({
  topicName,
}) => {
  const mainBreadcrumbs = (
    <Breadcrumb>
      <BreadcrumbItem to='/#/topics'>Topics</BreadcrumbItem>
      <BreadcrumbItem to='#' isActive>
        {topicName}
      </BreadcrumbItem>
    </Breadcrumb>
  );
  return (
    <section
      className='pf-c-page__main-breadcrumb'
      style={{ padding: '20px 20px' }}
    >
      {mainBreadcrumbs}
      <br />
      <br />
      <Title headingLevel='h1' size='xl'>
        {topicName}
      </Title>
    </section>
  );
};
