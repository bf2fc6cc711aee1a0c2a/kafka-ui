/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import {
  Breadcrumb,
  BreadcrumbItem,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import React from 'react';
import './TopicDetailView.patternfly.css';

export type TopicDetailHeadProps = {
  topicName: string;
};

export const TopicDetailHead: React.FC<TopicDetailHeadProps> = ({
  topicName,
}) => {
  return (
    <>
      <Breadcrumb className='breadcrumb-padding'>
        <BreadcrumbItem to='#/topics'>Topics</BreadcrumbItem>
        <BreadcrumbItem to={`#/topic/${topicName}`}>{topicName}</BreadcrumbItem>
      </Breadcrumb>
      <TextContent className='header-padding'>
        <Text component={TextVariants.h1}>{topicName}</Text>
      </TextContent>
    </>
  );
};
