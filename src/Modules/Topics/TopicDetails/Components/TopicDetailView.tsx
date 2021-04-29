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
            label={t('topic.jump_to_section')}
            scrollableSelector='#scrollablePageMain'
            offset={-164} // for header
            style={{ position: 'sticky' }}
          >
            <JumpLinksItem key={0} href='#core-configuration'>
              {t('topic.core_configuration')}
            </JumpLinksItem>
            <JumpLinksItem key={1} href='#messages'>
              {t('topic.messages')}
            </JumpLinksItem>
            <JumpLinksItem key={2} href='#log'>
              {t('topic.log')}
            </JumpLinksItem>
            <JumpLinksItem key={3} href='#replication'>
              {t('topic.replication')}
            </JumpLinksItem>
            <JumpLinksItem key={4} href='#cleanup'>
              {t('common.cleanup')}
            </JumpLinksItem>
            <JumpLinksItem key={5} href='#index'>
              {t('topic.index')}
            </JumpLinksItem>
            <JumpLinksItem key={6} href='#flush'>
              {t('topic.flush')}
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
                      {t('topic.core_configuration')}
                    </Text>
                    <Text component={TextVariants.p} className='section-info'>
                      {t('topic.core_config_info')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel={t('common.name')}
                    fieldLabel={t('topic.topic_name')}
                    fieldValue={topic.name}
                    popoverBody={t('topic.topic_name_description')}
                    popoverHeader={t('topic.topic_name')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.partitions')}
                    fieldLabel={t('topic.partitions')}
                    fieldValue={topic.numPartitions}
                    popoverBody={t('topic.partitions_description')}
                    popoverHeader={t('topic.partitions')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.replicas')}
                    fieldLabel={t('topic.replicas')}
                    fieldValue={'3'}
                    popoverBody={t('topic.replicas_description')}
                    popoverHeader={t('topic.replicas')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.min_insync_replicas')}
                    fieldLabel={t('topic.min_insync_replicas')}
                    fieldValue={'2'}
                    popoverBody={t('topic.min_insync_replicas_description')}
                    popoverHeader={t('topic.min_insync_replicas')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.retention_time')}
                    fieldLabel={t('topic.retention_time')}
                    fieldValue={topic['retention.ms']}
                    popoverBody={t('topic.retention_time_description')}
                    popoverHeader={t('topic.retention_time')}
                    unit={'ms'}
                    showUnlimited={true}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.retention_size')}
                    fieldLabel={t('topic.retention_size')}
                    fieldValue={topic['retention.bytes']}
                    popoverHeader={t('topic.retention_size')}
                    popoverBody={t('topic.retention_size_description')}
                    unit={'bytes'}
                    showUnlimited={true}
                  />

                  <TextContent className='section-margin'>
                    <Text
                      component={TextVariants.h2}
                      tabIndex={-1}
                      id='messages'
                    >
                      {t('topic.messages')}
                    </Text>
                    <Text component={TextVariants.p} className='section-info'>
                      {t('topic.message_section_info')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.max_message_size')}
                    fieldLabel={t('topic.max_message_size')}
                    fieldValue={'1048588'}
                    popoverBody={t('topic.max_message_size_description')}
                    popoverHeader={t('topic.max_message_size')}
                    unit={'bytes'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.message_timestamp_type')}
                    fieldLabel={t('topic.message_timestamp_type')}
                    fieldValue={'CreateTime'}
                    popoverBody={t('topic.message_timestamp_type_description')}
                    popoverHeader={t('topic.message_timestamp_type')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.max_message_timestamp_diff')}
                    fieldLabel={t('topic.max_message_timestamp_diff')}
                    fieldValue={'9223372036854775807'}
                    popoverBody={t(
                      'topic.max_message_timestamp_diff_description'
                    )}
                    popoverHeader={t('topic.max_message_timestamp_diff')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.compression_type')}
                    fieldLabel={t('topic.compression_type')}
                    fieldValue='Producer'
                    popoverBody={t('topic.compression_type_description')}
                    popoverHeader={t('topic.compression_type')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.message_format')}
                    fieldLabel={t('topic.message_format')}
                    fieldValue='2.7-IV2'
                    popoverBody={t('topic.message_format_description')}
                    popoverHeader={t('topic.message_format')}
                  />

                  <TextContent className='section-margin'>
                    <Text component={TextVariants.h2} tabIndex={-1} id='log'>
                      {t('topic.log')}
                    </Text>
                    <Text
                      component={TextVariants.p}
                      className='section-info-head'
                    >
                      {t('topic.log_section_info')}
                    </Text>
                    <Text
                      component={TextVariants.small}
                      className='section-info-note'
                    >
                      {t('topic.log_section_info_note')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.cleanup_policy')}
                    fieldLabel={t('topic.cleanup_policy')}
                    fieldValue={topic['cleanup.policy']}
                    popoverBody={t('topic.cleanup_policy_description')}
                    popoverHeader={t('topic.cleanup_policy')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.delete_retention_time')}
                    fieldLabel={t('topic.delete_retention_time')}
                    fieldValue={'86400000'}
                    popoverBody={t('topic.delete_retention_time_description')}
                    popoverHeader={t('topic.delete_retention_time')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.min_cleanable_ratio')}
                    fieldLabel={t('topic.min_cleanable_ratio')}
                    fieldValue={'0.5'}
                    popoverBody={t('topic.min_cleanable_ratio_description')}
                    popoverHeader={t('topic.min_cleanable_ratio')}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.min_compaction_lag_time')}
                    fieldLabel={t('topic.min_compaction_lag_time')}
                    fieldValue={'0'}
                    popoverBody={t('topic.min_compaction_lag_time_description')}
                    popoverHeader={t('topic.min_compaction_lag_time')}
                    unit={'ms'}
                  />

                  <TextContent className='section-margin'>
                    <Text
                      component={TextVariants.h2}
                      tabIndex={-1}
                      id='replication'
                    >
                      {t('topic.replication')}
                    </Text>
                    <Text
                      component={TextVariants.p}
                      className='section-info-head'
                    >
                      {t('topic.replication_section_info')}
                    </Text>
                    <Text
                      component={TextVariants.small}
                      className='section-info-note'
                    >
                      {t('topic.replication_section_info_note')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.unclean_leader_election')}
                    fieldLabel={t('topic.unclean_leader_election')}
                    fieldValue={'Disabled'}
                    popoverBody={t('topic.unclean_leader_election_description')}
                    popoverHeader={t('topic.unclean_leader_election')}
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
                      {t('topic.cleanup_section_info')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.log_segment_size')}
                    fieldLabel={t('topic.log_segment_size')}
                    fieldValue={'1073741824'}
                    popoverBody={t('topic.log_segment_size_description')}
                    popoverHeader={t('topic.log_segment_size')}
                    unit={'bytes'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.segement_time')}
                    fieldLabel={t('topic.segement_time')}
                    fieldValue={'604800000'}
                    popoverBody={t('topic.segement_time_description')}
                    popoverHeader={t('topic.segement_time')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.segment_jitter_time')}
                    fieldLabel={t('topic.segment_jitter_time')}
                    fieldValue={'0'}
                    popoverBody={t('topic.segment_jitter_time_description')}
                    popoverHeader={t('topic.segment_jitter_time')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.file_delete_delay')}
                    fieldLabel={t('topic.file_delete_delay')}
                    fieldValue={'60000'}
                    popoverBody={t('topic.file_delete_delay_description')}
                    popoverHeader={t('topic.file_delete_delay')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.preallocate_log_segment_files')}
                    fieldLabel={t('topic.preallocate_log_segment_files')}
                    fieldValue={'Disabled'}
                    popoverBody={t(
                      'topic.preallocate_log_segment_files_description'
                    )}
                    popoverHeader={t('topic.preallocate_log_segment_files')}
                  />

                  <TextContent className='section-margin'>
                    <Text component={TextVariants.h2} tabIndex={-1} id='index'>
                      {t('topic.index')}
                    </Text>
                    <Text component={TextVariants.p} className='section-info'>
                      {t('topic.index_section_info')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.index_interval_size')}
                    fieldLabel={t('topic.index_interval_size')}
                    fieldValue={'4096'}
                    popoverBody={t('topic.index_interval_size_description')}
                    popoverHeader={t('topic.index_interval_size')}
                    unit={'bytes'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.segment_index_size')}
                    fieldLabel={t('topic.segment_index_size')}
                    fieldValue={'10485760'}
                    popoverBody={t('topic.segment_index_size_description')}
                    popoverHeader={t('topic.segment_index_size')}
                    unit={'bytes'}
                  />

                  <TextContent className='section-margin'>
                    <Text component={TextVariants.h2} tabIndex={-1} id='flush'>
                      {t('topic.flush')}
                    </Text>
                    <Text component={TextVariants.p} className='section-info'>
                      {t('topic.flush_section_info')}
                    </Text>
                  </TextContent>

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.flush_interval_messages')}
                    fieldLabel={t('topic.flush_interval_messages')}
                    fieldValue={'9223372036854775807'}
                    popoverBody={t('topic.flush_interval_messages_description')}
                    popoverHeader={t('topic.flush_interval_messages')}
                    unit={'ms'}
                  />

                  <TextWithLabelPopover
                    btnAriaLabel={t('topic.flush_interval_time')}
                    fieldLabel={t('topic.flush_interval_time')}
                    fieldValue={'9223372036854775807'}
                    popoverBody={t('topic.flush_interval_time_description')}
                    popoverHeader={t('topic.flush_interval_time')}
                    unit={'ms'}
                  />

                  <Divider />

                  <TextContent className='section-margin'>
                    <Text component={TextVariants.h2} tabIndex={-1} id='delete'>
                      {t('topic.delete_topic')}
                    </Text>
                    <Text component={TextVariants.p} className='section-info'>
                      {t('topic.delete_topic_info')}
                    </Text>
                  </TextContent>

                  <Button
                    variant='danger'
                    className='section-margin'
                    onClick={deleteTopic}
                    data-testid='tabProperties-actionDelete'
                  >
                    {t('common.delete_topic')}
                  </Button>
                </SplitItem>
                <SplitItem>
                  <Button
                    variant='primary'
                    onClick={updateTopic}
                    data-testid='tabProperties-actionEdit'
                  >
                    {t('common.edit_props')}
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
