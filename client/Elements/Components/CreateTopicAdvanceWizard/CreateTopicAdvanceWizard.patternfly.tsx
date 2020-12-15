/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useMemo, useState } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Grid,
  GridItem,
  PageSection,
  PageGroup,
  JumpLinks,
  JumpLinksItem,
  ActionGroup,
  Button,
} from '@patternfly/react-core';
import '../CreateTopic/CreateTopicWizard.patternfly.css';

import { MessageSection } from './MessageSection.patternfly';

import { CoreConfiguration } from './CoreConfiguration.patternfly';

import { LogSection } from './LogSection.patternfly';
import { ReplicationSection } from './ReplicationSection.patternfly';
import { IndexSection } from './IndexSection.patternfly';
import { FlushSection } from './FlushSection.patternfly';
import { CleanupSection } from './CleanupSection.patternfly';

export interface ICoreConfigData {
  'topic-name': string;
  partitions: number;
  replicas: number;
  'min-in-sync': number;
  'retention-time': number;
  'retention-time-duration': string;
}

export interface IMessagesData {
  'max-message-size': number;
  unit: string;
  timestamp: string;
  'max-timestamp-diff': number;
  'timestamp-diff-unit': string;
  'compression-type': string;
}

export interface ILogFormData {
  'cleanup-policy': string;
  'retention-bytes': number;
  'retention-unit': string;
  'segment-type': number;
  'segment-unit': string;
}

export interface IReplicationData {
  'unclean-leader-election': boolean;
  'follower-replicas': string;
  'leader-replicas': string;
}

export interface ICleanupData {
  'delete-retention': number;
  'delete-retention-unit': string;
  'min-ratio': number;
  'min-lag-time': number;
  'min-lag-unit': string;
  'segment-time': number;
  'segment-time-unit': string;
  'jitter-time': number;
  'jitter-time-unit': string;
  'delete-delay': number;
  'delete-delay-unit': string;
  'log-preallocation': boolean;
}

export interface IIndexData {
  'index-interval-size': number;
  'index-interval-unit': string;
  'segment-index-size': number;
  'segment-index-unit': string;
}

export interface IFlushingData {
  'interval-messages': number;
  'interval-messages-unit': string;
  'interval-time': number;
  'interval-time-unit': string;
}

export const CreateTopicAdvanceWizard: React.FunctionComponent = () => {
  const [coreConfigData, setCoreConfigData] = useState<ICoreConfigData>({
    'topic-name': '',
    partitions: 12,
    replicas: 0,
    'min-in-sync': 1,
    'retention-time': 1,
    'retention-time-duration': 'day',
  });

  const [messagesData, setMessagesData] = useState<IMessagesData>({
    'max-message-size': 1,
    unit: 'bytes',
    timestamp: 'CreateTime',
    'max-timestamp-diff': 0,
    'timestamp-diff-unit': 'millisecond',
    'compression-type': 'Producer',
  });

  const [logFormData, setLogFormData] = useState<ILogFormData>({
    'cleanup-policy': 'delete',
    'retention-bytes': -1,
    'retention-unit': 'bytes',
    'segment-type': 10737441824,
    'segment-unit': 'bytes',
  });

  const [replicationData, setReplicationData] = useState<IReplicationData>({
    'unclean-leader-election': false,
    'follower-replicas': '',
    'leader-replicas': '',
  });

  const [cleanupData, setCleanupData] = useState<ICleanupData>({
    'delete-retention': 0,
    'delete-retention-unit': 'millisecond',
    'min-ratio': 124,
    'min-lag-time': 0,
    'min-lag-unit': 'millisecond',
    'segment-time': 0,
    'segment-time-unit': 'millisecond',
    'jitter-time': 0,
    'jitter-time-unit': 'millisecond',
    'delete-delay': 0,
    'delete-delay-unit': 'millisecond',
    'log-preallocation': false,
  });

  const [indexingData, setIndexingData] = useState<IIndexData>({
    'index-interval-size': 4096,
    'index-interval-unit': 'bytes',
    'segment-index-size': 1048,
    'segment-index-unit': 'bytes',
  });

  const [flushingData, setFlushingData] = useState<IFlushingData>({
    'interval-messages': 9824,
    'interval-messages-unit': 'millisecond',
    'interval-time': 9248,
    'interval-time-unit': 'millisecond',
  });

  const coreConfiguration: JSX.Element = useMemo(
    () => (
      <CoreConfiguration
        coreConfigData={coreConfigData}
        setCoreConfigData={setCoreConfigData}
      />
    ),
    [coreConfigData, setCoreConfigData]
  );

  const msgSection: JSX.Element = useMemo(
    () => (
      <MessageSection
        messagesFormData={messagesData}
        setMessagesFormData={setMessagesData}
      />
    ),
    [messagesData, setMessagesData]
  );

  const logSection: JSX.Element = useMemo(
    () => (
      <LogSection logFormData={logFormData} setLogFormData={setLogFormData} />
    ),
    [logFormData, setLogFormData]
  );

  const replicationSection: JSX.Element = useMemo(
    () => (
      <ReplicationSection
        replicationData={replicationData}
        setReplicationData={setReplicationData}
      />
    ),
    [replicationData, setReplicationData]
  );

  const cleanupSection: JSX.Element = useMemo(
    () => (
      <CleanupSection
        cleanupData={cleanupData}
        setCleanupData={setCleanupData}
      />
    ),
    [cleanupData, setCleanupData]
  );

  const indexSection: JSX.Element = useMemo(
    () => (
      <IndexSection
        indexingData={indexingData}
        setIndexingData={setIndexingData}
      />
    ),
    [indexingData, setIndexingData]
  );

  const flushingSection: JSX.Element = useMemo(
    () => (
      <FlushSection
        flushingData={flushingData}
        setFlushingData={setFlushingData}
      />
    ),
    [flushingData, setFlushingData]
  );

  return (
    <>
      <Grid hasGutter>
        <GridItem span={2} style={{ padding: '30px 30px' }}>
          <JumpLinks
            isVertical
            label='JUMP TO SECTION'
            scrollableSelector='#advanced-create-topic'
            style={{ position: 'absolute' }}
          >
            <JumpLinksItem key={0} href='#core-configuration'>
              Core configuration
            </JumpLinksItem>
            <JumpLinksItem key={1} href='#messages'>
              Messages
            </JumpLinksItem>
            <JumpLinksItem key={2} href='#log'>
              Log
            </JumpLinksItem>
            <JumpLinksItem key={3} href='#replication'>
              Replication
            </JumpLinksItem>
            <JumpLinksItem key={4} href='#cleanup'>
              Cleanup
            </JumpLinksItem>
            <JumpLinksItem key={5} href='#index'>
              Index
            </JumpLinksItem>
            <JumpLinksItem key={6} href='#flush'>
              Flush
            </JumpLinksItem>
          </JumpLinks>
        </GridItem>
        <GridItem span={10} style={{ padding: '30px 30px' }}>
          <div>
            <PageGroup
              hasOverflowScroll
              id='advanced-create-topic'
              className='topics-wizard-content'
            >
              <PageSection>
                {coreConfiguration}

                {msgSection}

                {logSection}

                {replicationSection}

                {cleanupSection}

                {indexSection}

                {flushingSection}

                <ActionGroup>
                  <Button variant='primary'>Create topic</Button>
                  <Button variant='link'>Cancel</Button>
                </ActionGroup>
              </PageSection>
            </PageGroup>
          </div>
        </GridItem>
      </Grid>
    </>
  );
};
