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
import { useTranslation } from 'react-i18next';
import { IAdvancedTopic } from '../../CreateTopic/Components/CreateTopicWizard';

export type TopicViewDetailProps = {
  /** Topic details */
  topic: IAdvancedTopic;
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
            label={t('common.jumpLinksLabel')}
            scrollableSelector='#scrollablePageMain'
            offset={-164} // for header
            style={{ position: 'sticky' }}
          >
            <JumpLinksItem key={0} href='#core-configuration'>
              {t('common.coreConfiguration')}
            </JumpLinksItem>
            <JumpLinksItem key={1} href='#messages'>
              {t('common.messages')}
            </JumpLinksItem>
            <JumpLinksItem key={2} href='#log'>
              {t('common.log')}
            </JumpLinksItem>
            <JumpLinksItem key={3} href='#replication'>
              {t('common.replication')}
            </JumpLinksItem>
            <JumpLinksItem key={4} href='#cleanup'>
              {t('common.cleanup')}
            </JumpLinksItem>
            <JumpLinksItem key={5} href='#index'>
              {t('common.index')}
            </JumpLinksItem>
            <JumpLinksItem key={6} href='#flush'>
              {t('common.flush')}
            </JumpLinksItem>
            <JumpLinksItem key={7} href='#delete'>
              {t('common.delete')}
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
                      {t('common.coreConfiguration')}
                    </Text>
                    <Text component={TextVariants.p} className='section-info'>
                      {t('createTopic.coreConfigInfo')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel={t('common.name')}
                    fieldLabel={t('createTopic.topicNameLabelHead')}
                    fieldValue={topic.name}
                    popoverBody={t('createTopic.topicNameLabelBody')}
                    popoverHeader={t('createTopic.topicNameLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.partitionsLabelHead')}
                    fieldLabel={t('createTopic.partitionsLabelHead')}
                    fieldValue={topic.numPartitions}
                    popoverBody={t('createTopic.partitionsLabelBody')}
                    popoverHeader={t('createTopic.partitionsLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.replicasLabelHead')}
                    fieldLabel={t('createTopic.replicasLabelHead')}
                    fieldValue={'3'}
                    popoverBody={t('createTopic.replicasLabelBody')}
                    popoverHeader={t('createTopic.replicasLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.inSyncReplicasLabelHead')}
                    fieldLabel={t('createTopic.inSyncReplicasLabelHead')}
                    fieldValue={'2'}
                    popoverBody={t('createTopic.inSyncReplicasLabelBody')}
                    popoverHeader={t('createTopic.inSyncReplicasLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.retentionTimeLabelHead')}
                    fieldLabel={t('createTopic.retentionTimeLabelHead')}
                    fieldValue={topic['retention.ms']}
                    popoverBody={t('createTopic.retentionTimeLabelBody')}
                    popoverHeader={t('createTopic.retentionTimeLabelHead')}
                    unit={'ms'}
                    showUnlimited={true}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.retentionBytesLabelHead')}
                    fieldLabel={t('createTopic.retentionBytesLabelHead')}
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
                      {t('common.messages')}
                    </Text>
                    <Text component={TextVariants.p} className='section-info'>
                      {t('createTopic.messageSectionInfo')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.maxMessageSizeLabelHead')}
                    fieldLabel={t('createTopic.maxMessageSizeLabelHead')}
                    fieldValue={'1048588'}
                    popoverBody={t('createTopic.maxMessageSizeLabelBody')}
                    popoverHeader={t('createTopic.maxMessageSizeLabelHead')}
                    unit={'bytes'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.messageTimestampLabelHead')}
                    fieldLabel={t('createTopic.messageTimestampLabelHead')}
                    fieldValue={'CreateTime'}
                    popoverBody={t('createTopic.messageTimestampLabelBody')}
                    popoverHeader={t('createTopic.messageTimestampLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.messageTimestampDiffLabelHead')}
                    fieldLabel={t('createTopic.messageTimestampDiffLabelHead')}
                    fieldValue={'9223372036854775807'}
                    popoverBody={t('createTopic.messageTimestampDiffLabelBody')}
                    popoverHeader={t(
                      'createTopic.messageTimestampDiffLabelHead'
                    )}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.compressionTypeLabelHead')}
                    fieldLabel={t('createTopic.compressionTypeLabelHead')}
                    fieldValue='Producer'
                    popoverBody={t('createTopic.compressionTypeLabelBody')}
                    popoverHeader={t('createTopic.compressionTypeLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.messageFormatLabelHead')}
                    fieldLabel={t('createTopic.messageFormatLabelHead')}
                    fieldValue='2.7-IV2'
                    popoverBody={t('createTopic.messageFormatLabelBody')}
                    popoverHeader={t('createTopic.messageFormatLabelHead')}
                  />

                  <TextContent className='section-margin'>
                    <Text component={TextVariants.h2} tabIndex={-1} id='log'>
                      {t('common.log')}
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
                    btnAriaLabel={t('createTopic.cleanupPolicyLabelHead')}
                    fieldLabel={t('createTopic.cleanupPolicyLabelHead')}
                    fieldValue={topic['cleanup.policy']}
                    popoverBody={t('createTopic.cleanupPolicyLabelBody')}
                    popoverHeader={t('createTopic.cleanupPolicyLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.deleteRetentionLabelHead')}
                    fieldLabel={t('createTopic.deleteRetentionLabelHead')}
                    fieldValue={'86400000'}
                    popoverBody={t('createTopic.deleteRetentionLabelBody')}
                    popoverHeader={t('createTopic.deleteRetentionLabelHead')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.minRatioLabelHead')}
                    fieldLabel={t('createTopic.minRatioLabelHead')}
                    fieldValue={'0.5'}
                    popoverBody={t('createTopic.minRatioLabelBody')}
                    popoverHeader={t('createTopic.minRatioLabelHead')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.minLagLabelHead')}
                    fieldLabel={t('createTopic.minLagLabelHead')}
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
                      {t('common.replication')}
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
                    btnAriaLabel={t('createTopic.leaderElectionLabelHead')}
                    fieldLabel={t('createTopic.leaderElectionLabelHead')}
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
                      {t('common.cleanup')}
                    </Text>
                    <Text component={TextVariants.p} className='section-info'>
                      {t('createTopic.cleanupSectionInfo')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.logSegmentLabelHead')}
                    fieldLabel={t('createTopic.logSegmentLabelHead')}
                    fieldValue={'1073741824'}
                    popoverBody={t('createTopic.logSegmentLabelBody')}
                    popoverHeader={t('createTopic.logSegmentLabelHead')}
                    unit={'bytes'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.segementTimeLabelHead')}
                    fieldLabel={t('createTopic.segementTimeLabelHead')}
                    fieldValue={'604800000'}
                    popoverBody={t('createTopic.segementTimeLabelBody')}
                    popoverHeader={t('createTopic.segementTimeLabelHead')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.jitterTimeLabelHead')}
                    fieldLabel={t('createTopic.jitterTimeLabelHead')}
                    fieldValue={'0'}
                    popoverBody={t('createTopic.jitterTimeLabelBody')}
                    popoverHeader={t('createTopic.jitterTimeLabelHead')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.deleteDelayLabelHead')}
                    fieldLabel={t('createTopic.deleteDelayLabelHead')}
                    fieldValue={'60000'}
                    popoverBody={t('createTopic.deleteDelayLabelBody')}
                    popoverHeader={t('createTopic.deleteDelayLabelHead')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.preallocateLabelHead')}
                    fieldLabel={t('createTopic.preallocateLabelHead')}
                    fieldValue={'Disabled'}
                    popoverBody={t('createTopic.preallocateLabelBody')}
                    popoverHeader={t('createTopic.preallocateLabelHead')}
                  />

                  <TextContent className='section-margin'>
                    <Text component={TextVariants.h2} tabIndex={-1} id='index'>
                      {t('common.index')}
                    </Text>
                    <Text component={TextVariants.p} className='section-info'>
                      {t('createTopic.indexSectionInfo')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.indexIntervalLabelHead')}
                    fieldLabel={t('createTopic.indexIntervalLabelHead')}
                    fieldValue={'4096'}
                    popoverBody={t('createTopic.indexIntervalLabelBody')}
                    popoverHeader={t('createTopic.indexIntervalLabelHead')}
                    unit={'bytes'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.segementIntervalLabelHead')}
                    fieldLabel={t('createTopic.segementIntervalLabelHead')}
                    fieldValue={'10485760'}
                    popoverBody={t('createTopic.segementIntervalLabelBody')}
                    popoverHeader={t('createTopic.segementIntervalLabelHead')}
                    unit={'bytes'}
                  />

                  <TextContent className='section-margin'>
                    <Text component={TextVariants.h2} tabIndex={-1} id='flush'>
                      {t('common.flush')}
                    </Text>
                    <Text component={TextVariants.p} className='section-info'>
                      {t('createTopic.flushSectionInfo')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.intervalMessagesLabelHead')}
                    fieldLabel={t('createTopic.intervalMessagesLabelHead')}
                    fieldValue={'9223372036854775807'}
                    popoverBody={t('createTopic.intervalMessagesLabelBody')}
                    popoverHeader={t('createTopic.intervalMessagesLabelHead')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('createTopic.intervalTimeLabelHead')}
                    fieldLabel={t('createTopic.intervalTimeLabelHead')}
                    fieldValue={'9223372036854775807'}
                    popoverBody={t('createTopic.intervalTimeLabelBody')}
                    popoverHeader={t('createTopic.intervalTimeLabelHead')}
                    unit={'ms'}
                  />

                  <Divider />

                  <TextContent className='section-margin'>
                    <Text component={TextVariants.h2} tabIndex={-1} id='delete'>
                      {t('createTopic.deleteTopicHead')}
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
                    {t('common.deleteTopic')}
                  </Button>
                </SplitItem>
                <SplitItem>
                  <Button
                    variant='primary'
                    onClick={updateTopic}
                    data-testid='tabProperties-actionEdit'
                  >
                    {t('common.editProps')}
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
