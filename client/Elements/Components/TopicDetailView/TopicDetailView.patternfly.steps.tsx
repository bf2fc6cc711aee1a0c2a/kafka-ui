/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { Given, When, Then, Fusion } from 'jest-cucumber-fusion';
import {
  TopicDetailView,
  TopicViewDetailProps,
} from './TopicDetailView.patternfly';
import { AdvancedTopic } from 'Contexts/Topic';

let renderResult: RenderResult;
let component: ReactElement;

const topic: AdvancedTopic = {
  topicName: 'SampleTopic2345',
  partitions: 52,
  replicas: 35,
  minInSyncReplicas: 78,
  retentionTime: 78,
  retentionTimeUnit: 'days',
  maxMessageSize: 50,
  messageSizeUnit: 'bytes',
  timestampType: 'CreateTime',
  maxTimestampDiff: 4,
  timestampDiffUnit: 'milliseconds',
  compressionType: 'Producer',
  cleanupPolicy: 'Delete',
  retentionBytes: -1,
  retentionUnit: 'byte',
  segmentSize: 78,
  segmentUnit: 'bytes',
  uncleanLeaderElection: false,
  followerReplicas: '',
  leaderReplicas: '',
  deleteRetentionTime: 789,
  deleteRetentionUnit: 'milliseconds',
  minRatio: 4,
  minLagTime: 58,
  minLagUnit: 'milliseconds',
  segmentTime: 6048000,
  segmentTimeUnit: 'milliseconds',
  jitterTime: 0,
  jitterTimeUnit: 'milliseconds',
  deleteDelay: 6000,
  deleteDelayUnit: 'milliseconds',
  logPreallocation: true,
  indexIntervalSize: 4096,
  indexIntervalUnit: 'bytes',
  segmentIndexSize: 10847560,
  segmentIndexUnit: 'bytes',
  intervalMessages: 783945,
  intervalMessagesUnit: 'milliseconds',
  intervalTime: 3894949,
  intervalTimeUnit: 'milliseconds',
};

const updateTopic = jest.fn();
const deleteTopic = jest.fn();

const props: TopicViewDetailProps = {
  topic,
  updateTopic,
  deleteTopic,
};

Given('the topic detail view component', () => {
  component = <TopicDetailView {...props} />;
});

When('it is rendered', () => {
  renderResult = render(component);
});

Then('it should display the expected text', () => {
  const { getByText } = renderResult;
  expect(getByText('JUMP TO SECTION')).toBeInTheDocument();
});

Fusion('TopicDetailView.feature');
