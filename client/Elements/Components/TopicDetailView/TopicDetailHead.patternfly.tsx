/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { Breadcrumb, BreadcrumbItem, TextContent, Text, TextVariants } from '@patternfly/react-core';
import React from 'react';
import './TopicDetailView.patternfly.css';

export const TopicDetailHead: React.FC<any> = ({
  topicName
}) => {
  return (
    <>
    <Breadcrumb className='breadcrumb-padding'>
      <BreadcrumbItem to="#">Topics</BreadcrumbItem>
      <BreadcrumbItem to="#">{topicName}</BreadcrumbItem>
    </Breadcrumb>
    <TextContent className='header-padding'>
      <Text component={TextVariants.h1}>{topicName}</Text>
    </TextContent>
    </>
  );
}