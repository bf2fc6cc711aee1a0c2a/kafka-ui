import React from 'react';
import {
  PageSection,
  PageGroup,
  JumpLinks,
  JumpLinksItem,
  TextContent,
  Text,
  TextVariants,
  Button,
  Divider,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  SplitItem,
  Split,
} from '@patternfly/react-core';
import './TopicDetailView.css';
import { TextWithLabelPopover } from '../../../../Components/TextWithLabelPopover/TextWithLabelPopover';
import { AdvancedTopic } from '../../../../Contexts/Topic';
import { useTranslation } from 'react-i18next';

export type TopicViewDetailProps = {
  /** Topic details */
  topic: AdvancedTopic;
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

  return (
    <PageSection padding={{ default: 'noPadding' }}>
      <Sidebar hasGutter>
        <SidebarPanel variant='sticky'>
          <JumpLinks
            isVertical
            label='JUMP TO SECTION'
            scrollableSelector='#scrollablePageMain'
            offset={-164} // for header
            style={{ position: 'sticky' }}
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
        </SidebarPanel>
        <SidebarContent>
          <PageGroup hasOverflowScroll id='topic-detail-view'>
            <PageSection padding={{ default: 'noPadding' }}>
              <Split>
                <SplitItem isFilled>
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
                    fieldValue={'3'}
                    popoverBody={t('createTopic.replicasLabelBody')}
                    popoverHeader={t('createTopic.replicasLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail min-in-sync replica'
                    fieldLabel='Minimum in-sync replicas'
                    fieldValue={'2'}
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
                    showUnlimited={true}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail retention size'
                    fieldLabel='Retention Size'
                    fieldValue={topic['retention.bytes']}
                    popoverHeader={t('createTopic.retentionBytesLabelHead')}
                    popoverBody={t('createTopic.retentionBytesLabelBody')}
                    unit={'bytes'}
                    showUnlimited={true}
                  />

                  <TextContent className='section-margin'>
                    <Text
                      component={TextVariants.h2}
                      tabIndex={-1}
                      id='messages'
                    >
                      Messages
                    </Text>
                    <Text component={TextVariants.p} className='section-info'>
                      {t('createTopic.messageSectionInfo')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail max message bytes'
                    fieldLabel='Maximum message bytes'
                    fieldValue={'1048588'}
                    popoverBody={t('createTopic.maxMessageSizeLabelBody')}
                    popoverHeader={t('createTopic.maxMessageSizeLabelHead')}
                    unit={'bytes'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail message timestamp type'
                    fieldLabel='Message timestamp type'
                    fieldValue={'CreateTime'}
                    popoverBody={t('createTopic.messageTimestampLabelBody')}
                    popoverHeader={t('createTopic.messageTimestampLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail message timestamp difference'
                    fieldLabel='Maximum message timestamp difference'
                    fieldValue={'9223372036854775807'}
                    popoverBody={t('createTopic.messageTimestampDiffLabelBody')}
                    popoverHeader={t(
                      'createTopic.messageTimestampDiffLabelHead'
                    )}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail compression type'
                    fieldLabel='Compression type'
                    fieldValue='Producer'
                    popoverBody={t('createTopic.compressionTypeLabelBody')}
                    popoverHeader={t('createTopic.compressionTypeLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail message format version'
                    fieldLabel='Message format version'
                    fieldValue='2.7-IV2'
                    popoverBody={t('createTopic.messageFormatLabelBody')}
                    popoverHeader={t('createTopic.messageFormatLabelHead')}
                  />

                  <TextContent className='section-margin'>
                    <Text component={TextVariants.h2} tabIndex={-1} id='log'>
                      Log
                    </Text>
                    <Text
                      component={TextVariants.p}
                      className='section-info-head'
                    >
                      {t('createTopic.logSectionInfo')}
                    </Text>
                    <Text
                      component={TextVariants.small}
                      className='section-info-note'
                    >
                      {t('createTopic.logSectionInfoNote')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail cleanup policy'
                    fieldLabel='Cleanup policy'
                    fieldValue={topic['cleanup.policy']}
                    popoverBody={t('createTopic.cleanupPolicyLabelBody')}
                    popoverHeader={t('createTopic.cleanupPolicyLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail retention bytes'
                    fieldLabel='Delete retention time'
                    fieldValue={'86400000'}
                    popoverBody={t('createTopic.deleteRetentionLabelBody')}
                    popoverHeader={t('createTopic.deleteRetentionLabelHead')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail min cleanable dirty ratio'
                    fieldLabel='Minimum cleanable dirty ratio'
                    fieldValue={'0.5'}
                    popoverBody={t('createTopic.minRatioLabelBody')}
                    popoverHeader={t('createTopic.minRatioLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail min compaction lag time'
                    fieldLabel='Minimum compaction lag time'
                    fieldValue={'0'}
                    popoverBody={t('createTopic.minLagLabelBody')}
                    popoverHeader={t('createTopic.minLagLabelHead')}
                    unit={'ms'}
                  />

                  <TextContent className='section-margin'>
                    <Text
                      component={TextVariants.h2}
                      tabIndex={-1}
                      id='replication'
                    >
                      Replication
                    </Text>
                    <Text
                      component={TextVariants.p}
                      className='section-info-head'
                    >
                      {t('createTopic.replicationSectionInfo')}
                    </Text>
                    <Text
                      component={TextVariants.small}
                      className='section-info-note'
                    >
                      {t('createTopic.replicationSectionInfoNote')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail unclean leader election'
                    fieldLabel='Unclean leader election'
                    fieldValue={'Disabled'}
                    popoverBody={t('createTopic.leaderElectionLabelBody')}
                    popoverHeader={t('createTopic.leaderElectionLabelHead')}
                  />

                  <TextContent className='section-margin'>
                    <Text
                      component={TextVariants.h2}
                      tabIndex={-1}
                      id='cleanup'
                    >
                      Cleanup
                    </Text>
                    <Text component={TextVariants.p} className='section-info'>
                      {t('createTopic.cleanupSectionInfo')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel='topic detail max message bytes'
                    fieldLabel='Log segment size'
                    fieldValue={'1073741824'}
                    popoverBody={t('createTopic.logSegmentLabelHead')}
                    popoverHeader={t('createTopic.logSegmentLabelBody')}
                    unit={'bytes'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='segment time'
                    fieldLabel='Segment time'
                    fieldValue={'604800000'}
                    popoverBody={t('createTopic.segementTimeLabelBody')}
                    popoverHeader={t('createTopic.segementTimeLabelHead')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='segment jitter time'
                    fieldLabel='Segment jitter time'
                    fieldValue={'0'}
                    popoverBody={t('createTopic.jitterTimeLabelBody')}
                    popoverHeader={t('createTopic.jitterTimeLabelHead')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='file delete delay'
                    fieldLabel='File delete delay'
                    fieldValue={'60000'}
                    popoverBody={t('createTopic.deleteDelayLabelBody')}
                    popoverHeader={t('createTopic.deleteDelayLabelHead')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='preallocation log segment files'
                    fieldLabel='Preallocation log segment files'
                    fieldValue={'Disabled'}
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
                    fieldValue={'4096'}
                    popoverBody={t('createTopic.indexIntervalLabelBody')}
                    popoverHeader={t('createTopic.indexIntervalLabelHead')}
                    unit={'bytes'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='segment index size'
                    fieldLabel='Segment index size'
                    fieldValue={'10485760'}
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
                    fieldValue={'9223372036854775807'}
                    popoverBody={t('createTopic.intervalMessagesLabelBody')}
                    popoverHeader={t('createTopic.intervalMessagesLabelHead')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel='flush interval time'
                    fieldLabel='Flush interval time'
                    fieldValue={'9223372036854775807'}
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
                    data-testid='tabProperties-actionDelete'
                  >
                    Delete topic
                  </Button>
                </SplitItem>
                <SplitItem>
                  <Button
                    variant='primary'
                    onClick={updateTopic}
                    data-testid='tabProperties-actionEdit'
                  >
                    Edit properties
                  </Button>
                </SplitItem>
              </Split>
            </PageSection>
          </PageGroup>
        </SidebarContent>
      </Sidebar>
    </PageSection>
  );
};
