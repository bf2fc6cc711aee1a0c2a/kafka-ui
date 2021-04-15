import React, { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { Given, When, Then, Fusion } from 'jest-cucumber-fusion';
import {
  TopicDetailView,
  TopicViewDetailProps,
} from '../../../../Modules/Topics/TopicDetails/Components/TopicDetailView';
import { AdvancedTopic } from '../../../../Contexts/Topic';
import { I18nextProvider } from 'react-i18next';
import kafkai18n from '../../../../../test-utils/i18n';

let renderResult: RenderResult;
let component: ReactElement;

const topic: AdvancedTopic = {
  name: 'SampleTopic2345',
  numPartitions: '52',
  replicationFactor: '35',
  'min.insync.replicas': '78',
  'retention.ms': '78',
  'retention.ms.unit': 'days',
  'max.message.bytes': '50',
  'max.message.bytes.unit': 'bytes',
  'message.timestamp.type': 'CreateTime',
  'message.timestamp.difference.max.ms': '4',
  'message.timestamp.difference.max.ms.unit': 'milliseconds',
  'compression.type': 'Producer',
  'cleanup.policy': 'Delete',
  'retention.bytes': '-1',
  'retention.bytes.unit': 'bytes',
  'log.segment.bytes': '78',
  'log.segment.bytes.unit': 'bytes',
  'unclean.leader.election.enable': 'false',
  'follower.replication.throttled.replicas': '',
  'leader.replication.throttled.replicas': '',
  'delete.retention.ms': '789',
  'delete.retention.ms.unit': 'milliseconds',
  'min.cleanable.dirty.ratio': '4',
  'min.compaction.lag.ms': '58',
  'min.compaction.lag.ms.unit': 'milliseconds',
  'segment.ms': '6048000',
  'segment.ms.unit': 'milliseconds',
  'segment.jitter.ms': '0',
  'segment.jitter.ms.unit': 'milliseconds',
  'file.delete.delay.ms': '6000',
  'file.delete.delay.ms.unit': 'milliseconds',
  preallocate: 'true',
  'index.interval.bytes': '4096',
  'index.interval.bytes.unit': 'bytes',
  'segment.index.bytes': '10847560',
  'segment.index.bytes.unit': 'bytes',
  'flush.messages': '783945',
  'flush.messages.unit': 'milliseconds',
  'flush.ms': '3894949',
  'flush.ms.unit': 'milliseconds',
};

const updateTopic = jest.fn();
const deleteTopic = jest.fn();

const props: TopicViewDetailProps = {
  topic,
  updateTopic,
  deleteTopic,
};

Given('the topic detail view component', () => {
  component = (
    <I18nextProvider i18n={kafkai18n}>
      <TopicDetailView {...props} />
    </I18nextProvider>
  );
});

When('it is rendered', () => {
  renderResult = render(component);
});

Then('it should display the expected text', () => {
  const { getByText } = renderResult;
  expect(getByText('JUMP TO SECTION')).toBeInTheDocument();
});

Fusion('TopicDetailView.feature');
