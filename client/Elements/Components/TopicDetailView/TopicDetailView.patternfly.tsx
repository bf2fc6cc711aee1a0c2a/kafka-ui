/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useState } from "react";
import {
  Grid,
  GridItem,
  PageSection,
  PageGroup,
  JumpLinks,
  JumpLinksItem,
  TextContent,
  Text,
  TextVariants,
  Button,
  Divider,
} from "@patternfly/react-core";
import "./TopicDetailView.patternfly.css";
import { TextWithLabelPopover } from "../Common/TextWithLabelPopover/TextWithLabelPopover.patternfly";
import { AdvancedTopic2 } from "Contexts/Topic";
import { useTranslation } from "react-i18next";

export type TopicViewDetailProps = {
  /** Topic details */
  topic: AdvancedTopic2;
  /** Method to delete topic */
  deleteTopic: () => void;
  /** Method to update topic */
  updateTopic: () => void;
};

export const TopicDetailView: React.FunctionComponent<TopicViewDetailProps> = ({
  topic,
  deleteTopic,
  updateTopic,
}) => {
  const { t } = useTranslation();

  const [deleteModal, setDeleteModal] = useState(false);
  const onDelete = () => {
    setDeleteModal(true);
  };
  return (
    <Grid hasGutter>
      <GridItem span={2} className='grid-item-padding'>
        <JumpLinks
          isVertical
          label='JUMP TO SECTION'
          scrollableSelector='#topic-detail-view'
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
          <JumpLinksItem key={7} href='#delete'>
            Delete
            </JumpLinksItem>
        </JumpLinks>
      </GridItem>
      <GridItem span={8} className='grid-item-padding'>
        <PageGroup hasOverflowScroll id='topic-detail-view'>
          <PageSection>
            <TextContent>
              <Text
                component={TextVariants.h2}
                tabIndex={-1}
                id='core-configuration'
              >
                Core configuration
                </Text>
              <Text component={TextVariants.p} className='section-info'>
                {t('createTopic.coreConfigInfo')}
              </Text>
            </TextContent>

            <TextWithLabelPopover
              btnAriaLabel='topic detail name'
              fieldLabel='Name'
              fieldValue={topic.name}
              popoverBody={t('createTopic.topicNameLabelBody')}
              popoverHeader={t('createTopic.topicNameLabelHead')}
            />

            <TextWithLabelPopover
              btnAriaLabel='topic detail partition'
              fieldLabel='Partitions'
              fieldValue={topic.numPartitions}
              popoverBody={t('createTopic.partitionsLabelBody')}
              popoverHeader={t('createTopic.partitionsLabelHead')}
            />

            <TextWithLabelPopover
              btnAriaLabel='topic detail replicas'
              fieldLabel='Replicas'
              fieldValue={topic.replicationFactor}
              popoverBody={t('createTopic.replicasLabelBody')}
              popoverHeader={t('createTopic.replicasLabelHead')}
            />

            <TextWithLabelPopover
              btnAriaLabel='topic detail min-in-sync replica'
              fieldLabel='Minimum in-sync replicas'
              fieldValue={topic['min.insync.replicas']}
              popoverBody={t('createTopic.inSyncReplicasLabelBody')}
              popoverHeader={t('createTopic.inSyncReplicasLabelHead')}
            />

            <TextWithLabelPopover
              btnAriaLabel='topic detail retention time'
              fieldLabel='Retention Time'
              fieldValue={topic['retention.ms']}
              popoverBody={t('createTopic.retentionTimeLabelBody')}
              popoverHeader={t('createTopic.retentionTimeLabelHead')}
              unit={'ms'}
            />

            <TextContent className='section-margin'>
              <Text component={TextVariants.h2} tabIndex={-1} id='messages'>
                Messages
                </Text>
              <Text component={TextVariants.p} className='section-info'>
                {t('createTopic.messageSectionInfo')}
              </Text>
            </TextContent>

            <TextWithLabelPopover
              btnAriaLabel='topic detail max message bytes'
              fieldLabel='Maximum message bytes'
              fieldValue={topic['max.message.bytes.message.bytes']}
              popoverBody={t('createTopic.maxMessageSizeLabelBody')}
              popoverHeader={t('createTopic.maxMessageSizeLabelHead')}
              unit={'bytes'}
            />

            <TextWithLabelPopover
              btnAriaLabel='topic detail message timestamp type'
              fieldLabel='Message timestamp type'
              fieldValue={topic['message.timestamp.type']}
              popoverBody={t('createTopic.messageTimestampLabelBody')}
              popoverHeader={t('createTopic.messageTimestampLabelHead')}
            />

            <TextWithLabelPopover
              btnAriaLabel='topic detail message timestamp difference'
              fieldLabel='Maximum message timestamp difference'
              fieldValue={topic['message.timestamp.difference.max.ms']}
              popoverBody={t('createTopic.messageTimestampDiffLabelBody')}
              popoverHeader={t('createTopic.messageTimestampDiffLabelHead')}
              unit={'ms'}
            />

            <TextWithLabelPopover
              btnAriaLabel='topic detail compression type'
              fieldLabel='Compression type'
              fieldValue={topic['compression.type']}
              popoverBody={t('createTopic.compressionTypeLabelBody')}
              popoverHeader={t('createTopic.compressionTypeLabelHead')}
            />

            <TextContent className='section-margin'>
              <Text component={TextVariants.h2} tabIndex={-1} id='log'>
                Log
                </Text>
              <Text component={TextVariants.p} className='section-info'>
                {t('createTopic.logSectionInfo')}
              </Text>
            </TextContent>

            <TextWithLabelPopover
              btnAriaLabel='topic detail cleanup policy'
              fieldLabel='Cleanup policy'
              fieldValue={topic['log.cleanup.policy']}
              popoverBody={t('createTopic.cleanupPolicyLabelBody')}
              popoverHeader={t('createTopic.cleanupPolicyLabelHead')}
            />

            <TextWithLabelPopover
              btnAriaLabel='topic detail retention bytes'
              fieldLabel='Retention bytes'
              fieldValue={topic['log.retention.bytes']}
              popoverBody={t('createTopic.retentionBytesLabelBody')}
              popoverHeader={t('createTopic.retentionBytesLabelHead')}
              unit={'bytes'}
            />

            {/* TODO: Clarify the field from wireframes */}
            {/* <TextWithLabelPopover
                  btnAriaLabel='topic detail log segment types'
                  fieldLabel='Log segment types'

                  fieldValue={topic.}
                  popoverBody={t('createTopic.compressionTypeLabelBody')}
                  popoverHeader={t('createTopic.compressionTypeLabelHead')}
                /> */}

            <TextContent className='section-margin'>
              <Text
                component={TextVariants.h2}
                tabIndex={-1}
                id='replication'
              >
                Replication
                </Text>
              <Text component={TextVariants.p} className='section-info'>
                {t('createTopic.replicationSectionInfo')}
              </Text>
            </TextContent>

            <TextWithLabelPopover
              btnAriaLabel='topic detail unclean leader election'
              fieldLabel='Unclean leader election'
              fieldValue={topic['unclean.leader.election.enable']}
              popoverBody={t('createTopic.leaderElectionLabelBody')}
              popoverHeader={t('createTopic.leaderElectionLabelHead')}
            />

            <TextWithLabelPopover
              btnAriaLabel='topic detail throttled follower replicas'
              fieldLabel='Follower replication throttled replicas'
              fieldValue={topic['follower.replication.throttled.replicas']}
              popoverBody={t('createTopic.followerReplicaLabelBody')}
              popoverHeader={t('createTopic.followerReplicaLabelHead')}
            />

            <TextWithLabelPopover
              btnAriaLabel='topic detail throttled leader replicas'
              fieldLabel='Leader replication throttled replicas'
              fieldValue={topic['leader.replication.throttled.replicas']}
              popoverBody={t('createTopic.leaderReplicaLabelBody')}
              popoverHeader={t('createTopic.leaderReplicaLabelHead')}
            />

            <TextContent className='section-margin'>
              <Text component={TextVariants.h2} tabIndex={-1} id='cleanup'>
                Cleanup
                </Text>
              <Text component={TextVariants.p} className='section-info'>
                {t('createTopic.cleanupSectionInfo')}
              </Text>
            </TextContent>

            <TextWithLabelPopover
              btnAriaLabel='topic detail min cleanable dirty ratio'
              fieldLabel='Minimum cleanable dirty ratio'
              fieldValue={topic['min.cleanable.dirty.ratio']}
              popoverBody={t('createTopic.minRatioLabelBody')}
              popoverHeader={t('createTopic.minRatioLabelHead')}
            />

            <TextWithLabelPopover
              btnAriaLabel='topic detail min compaction lag time'
              fieldLabel='Minimum compaction lag time'
              fieldValue={topic['min.compaction.lag.ms']}
              popoverBody={t('createTopic.minLagLabelBody')}
              popoverHeader={t('createTopic.minLagLabelHead')}
              unit={'ms'}
            />

            <TextWithLabelPopover
              btnAriaLabel='segment time'
              fieldLabel='Segment time'
              fieldValue={topic['segment.ms']}
              popoverBody={t('createTopic.segementTimeLabelBody')}
              popoverHeader={t('createTopic.segementTimeLabelHead')}
              unit={'ms'}
            />

            <TextWithLabelPopover
              btnAriaLabel='segment jitter time'
              fieldLabel='Segment jitter time'
              fieldValue={topic['segment.jitter.ms']}
              popoverBody={t('createTopic.jitterTimeLabelBody')}
              popoverHeader={t('createTopic.jitterTimeLabelHead')}
              unit={'ms'}
            />

            <TextWithLabelPopover
              btnAriaLabel='file delete delay'
              fieldLabel='File delete delay'
              fieldValue={topic['file.delete.delay.ms']}
              popoverBody={t('createTopic.deleteDelayLabelBody')}
              popoverHeader={t('createTopic.deleteDelayLabelHead')}
              unit={'ms'}
            />

            <TextWithLabelPopover
              btnAriaLabel='preallocation log segment files'
              fieldLabel='Preallocation log segment files'
              fieldValue={topic.preallocate}
              popoverBody={t('createTopic.preallocateLabelBody')}
              popoverHeader={t('createTopic.preallocateLabelHead')}
            />

            <TextContent className='section-margin'>
              <Text component={TextVariants.h2} tabIndex={-1} id='index'>
                Index
                </Text>
              <Text component={TextVariants.p} className='section-info'>
                {t('createTopic.indexSectionInfo')}
              </Text>
            </TextContent>

            <TextWithLabelPopover
              btnAriaLabel='index interval size'
              fieldLabel='Index interval size'
              fieldValue={topic['index.interval.bytes']}
              popoverBody={t('createTopic.indexIntervalLabelBody')}
              popoverHeader={t('createTopic.indexIntervalLabelHead')}
              unit={'bytes'}
            />

            <TextWithLabelPopover
              btnAriaLabel='segment index size'
              fieldLabel='Segment index size'
              fieldValue={topic['segment.index.bytes']}
              popoverBody={t('createTopic.segementIntervalLabelBody')}
              popoverHeader={t('createTopic.segementIntervalLabelHead')}
              unit={'bytes'}
            />

            <TextContent className='section-margin'>
              <Text component={TextVariants.h2} tabIndex={-1} id='flush'>
                Flush
                </Text>
              <Text component={TextVariants.p} className='section-info'>
                {t('createTopic.flushSectionInfo')}
              </Text>
            </TextContent>

            <TextWithLabelPopover
              btnAriaLabel='flush interval messages'
              fieldLabel='Flush interval messages'
              fieldValue={topic['flush.messages']}
              popoverBody={t('createTopic.intervalMessagesLabelBody')}
              popoverHeader={t('createTopic.intervalMessagesLabelHead')}
              unit={'ms'}
            />

            <TextWithLabelPopover
              btnAriaLabel='flush interval time'
              fieldLabel='Flush interval time'
              fieldValue={topic['flush.ms']}
              popoverBody={t('createTopic.intervalTimeLabelBody')}
              popoverHeader={t('createTopic.intervalTimeLabelHead')}
              unit={'ms'}
            />

            <Divider />

            <TextContent className='section-margin'>
              <Text component={TextVariants.h2} tabIndex={-1} id='delete'>
                Delete topic (irreversible)
                </Text>
              <Text component={TextVariants.p} className='section-info'>
                {t('createTopic.deleteTopicInfo')}
              </Text>
            </TextContent>

            <Button
              variant='danger'
              className='section-margin'
              onClick={deleteTopic}
            >
              Delete topic
              </Button>
          </PageSection>
        </PageGroup>
      </GridItem>
      <GridItem span={2} className='grid-item-padding'>
        <Button variant='primary' onClick={updateTopic}>
          Edit properties
          </Button>
      </GridItem>
    </Grid>
  );
};
