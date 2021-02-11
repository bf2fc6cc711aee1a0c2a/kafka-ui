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
import { AdvancedTopic2 } from 'Contexts/Topic';

let renderResult: RenderResult;
let component: ReactElement;

const topic: AdvancedTopic2 = {
  name: 'SampleTopic2345',
  numPartitions: '52',
  replicationFactor: '35',
  'min.insync.replicas': '78',
  'retention.ms': '78',
  retentionTimeUnit: 'days',
  'max.message.bytes': '50',
  messageSizeUnit: 'bytes',
  'message.timestamp.type': 'CreateTime',
  'message.timestamp.difference.max.ms': '4',
  timestampDiffUnit: 'milliseconds',
  'compression.type': 'Producer',
  'log.cleanup.policy': 'Delete',
  'log.retention.bytes': '-1',
  retentionUnit: 'byte',
  'log.segment.bytes': '78',
  segmentUnit: 'bytes',
  'unclean.leader.election.enable': 'false',
  'follower.replication.throttled.replicas': '',
  'leader.replication.throttled.replicas': '',
  'delete.retention.ms': '789',
  deleteRetentionUnit: 'milliseconds',
  'min.cleanable.dirty.ratio': '4',
  'min.compaction.lag.ms': '58',
  minLagUnit: 'milliseconds',
  'segment.ms': '6048000',
  segmentTimeUnit: 'milliseconds',
  'segment.jitter.ms': '0',
  jitterTimeUnit: 'milliseconds',
  'file.delete.delay.ms': '6000',
  deleteDelayUnit: 'milliseconds',
  preallocate: 'true',
  'index.interval.bytes': '4096',
  indexIntervalUnit: 'bytes',
  'segment.index.bytes': '10847560',
  segmentIndexUnit: 'bytes',
  'flush.messages': '783945',
  intervalMessagesUnit: 'milliseconds',
  'flush.ms': '3894949',
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
