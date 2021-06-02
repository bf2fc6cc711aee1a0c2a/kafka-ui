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
  Form,
  FormSection,
} from '@patternfly/react-core';
import {
  DEFAULT_MESSAGE_TIMESTAMP_TYPE,
  DEFAULT_DELETE_RETENTION_TIME,
  DEFAULT_FILE_DELETE_DELAY,
  DEFAULT_INDEX_INTERVAL_SIZE,
  DEFAULT_LOG_SEGMENT_SIZE,
  DEFAULT_MAXIMUM_MESSAGE_BYTES,
  DEFAULT_MINIMUM_COMPACTION_LAG_TIME,
  DEFAULT_MIN_CLEANBLE_RATIO,
  DEFAULT_MIN_INSYNC_REPLICAS,
  DEFAULT_REPLICAS,
  DEFAULT_SEGMENT_INDEX_SIZE,
  DEFAULT_SEGMENT_JITTER_TIME,
  DEFAULT_SEGMENT_TIME,
  DEFAULT_MAX_MESSAGE_TIMESTAMP_DIFF,
  DEFAULT_FLUSH_INTERVAL_MESSAGES,
  DEFAULT_FLUSH_INTERVAL_TIME
} from '../../../../Constant';
import './TopicDetailView.css';
import { TextWithLabelPopover } from '../../../../Components/TextWithLabelPopover/TextWithLabelPopover';
import { useTranslation } from 'react-i18next';
import { IAdvancedTopic } from '../../CreateTopic/Components/CreateTopicWizard';
import { convertRetentionSize, convertRetentionTime } from '../../CreateTopic/utils';

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
    <PageSection padding={{ default: "noPadding" }}>
      <Sidebar hasGutter>
        <SidebarPanel variant="sticky">
          <JumpLinks
            isVertical
            label={t("topic.jump_to_section")}
            scrollableSelector="#scrollablePageMain"
            offset={-164} // for header
            style={{ position: "sticky" }}
          >
            <JumpLinksItem key={0} href="#core-configuration">
              {t("topic.core_configuration")}
            </JumpLinksItem>
            <JumpLinksItem key={1} href="#messages">
              {t("topic.messages")}
            </JumpLinksItem>
            <JumpLinksItem key={2} href="#log">
              {t("topic.log")}
            </JumpLinksItem>
            <JumpLinksItem key={3} href="#replication">
              {t("topic.replication")}
            </JumpLinksItem>
            <JumpLinksItem key={4} href="#cleanup">
              {t("common.cleanup")}
            </JumpLinksItem>
            <JumpLinksItem key={5} href="#index">
              {t("topic.index")}
            </JumpLinksItem>
            <JumpLinksItem key={6} href="#flush">
              {t("topic.flush")}
            </JumpLinksItem>
            <JumpLinksItem key={7} href="#delete">
              {t("common.delete")}
            </JumpLinksItem>
          </JumpLinks>
        </SidebarPanel>
        <SidebarContent>
          <PageGroup hasOverflowScroll id="topic-detail-view">
            <PageSection padding={{ default: "noPadding" }}>
              <Split>
                <SplitItem isFilled>
                  <Form>
                    <FormSection
                      title={t("topic.core_configuration")}
                      id="core-configuration"
                      titleElement={"h2"}
                    >
                      <TextContent>
                        <Text
                          component={TextVariants.p}
                          className="section-info"
                        >
                          {t("topic.core_config_info")}
                        </Text>
                      </TextContent>

                      <TextWithLabelPopover
                        fieldId="topic-name"
                        btnAriaLabel={t("common.name")}
                        fieldLabel={t("topic.topic_name")}
                        fieldValue={topic.name}
                        popoverBody={t("topic.topic_name_description")}
                        popoverHeader={t("topic.topic_name")}
                      />

                      <TextWithLabelPopover
                        fieldId="partitions"
                        btnAriaLabel={t("topic.partitions")}
                        fieldLabel={t("topic.partitions")}
                        fieldValue={topic.numPartitions}
                        popoverBody={t("topic.partitions_description")}
                        popoverHeader={t("topic.partitions")}
                      />

                      <TextWithLabelPopover
                        fieldId="replicas"
                        btnAriaLabel={t("topic.replicas")}
                        fieldLabel={t("topic.replicas")}
                        fieldValue={DEFAULT_REPLICAS}
                        popoverBody={t("topic.replicas_description")}
                        popoverHeader={t("topic.replicas")}
                      />

                      <TextWithLabelPopover
                        fieldId="min-insync-replicas"
                        btnAriaLabel={t("topic.min_insync_replicas")}
                        fieldLabel={t("topic.min_insync_replicas")}
                        fieldValue={DEFAULT_MIN_INSYNC_REPLICAS}
                        popoverBody={t("topic.min_insync_replicas_description")}
                        popoverHeader={t("topic.min_insync_replicas")}
                      />

                      <TextWithLabelPopover
                        fieldId="retention-time"
                        btnAriaLabel={t("topic.retention_time")}
                        fieldLabel={t("topic.retention_time")}
                        fieldValue={convertRetentionTime(
                          Number(topic["retention.ms"])
                        )}
                        popoverBody={t("topic.retention_time_description")}
                        popoverHeader={t("topic.retention_time")}
                        showUnlimited={true}
                      />

                      <TextWithLabelPopover
                        fieldId="retention-size"
                        btnAriaLabel={t("topic.retention_size")}
                        fieldLabel={t("topic.retention_size")}
                        fieldValue={convertRetentionSize(
                          Number(topic["retention.bytes"])
                        )}
                        popoverHeader={t("topic.retention_size")}
                        popoverBody={t("topic.retention_size_description")}
                        showUnlimited={true}
                      />
                    </FormSection>
                    <FormSection
                      title={t("topic.messages")}
                      id="messages"
                      titleElement={"h2"}
                    >
                      <TextContent>
                        <Text
                          component={TextVariants.p}
                          className="section-info"
                        >
                          {t("topic.message_section_info")}
                        </Text>
                      </TextContent>

                      <TextWithLabelPopover
                        fieldId="max-message-size"
                        btnAriaLabel={t("topic.max_message_size")}
                        fieldLabel={t("topic.max_message_size")}
                        fieldValue={DEFAULT_MAXIMUM_MESSAGE_BYTES}
                        popoverBody={t("topic.max_message_size_description")}
                        popoverHeader={t("topic.max_message_size")}
                      />

                      <TextWithLabelPopover
                        fieldId="message-timestamp-type"
                        btnAriaLabel={t("topic.message_timestamp_type")}
                        fieldLabel={t("topic.message_timestamp_type")}
                        fieldValue={DEFAULT_MESSAGE_TIMESTAMP_TYPE}
                        popoverBody={t(
                          "topic.message_timestamp_type_description"
                        )}
                        popoverHeader={t("topic.message_timestamp_type")}
                      />

                      <TextWithLabelPopover
                        fieldId="max-message-timestamp-diff"
                        btnAriaLabel={t("topic.max_message_timestamp_diff")}
                        fieldLabel={t("topic.max_message_timestamp_diff")}
                        fieldValue={DEFAULT_MAX_MESSAGE_TIMESTAMP_DIFF}
                        popoverBody={t(
                          "topic.max_message_timestamp_diff_description"
                        )}
                        popoverHeader={t("topic.max_message_timestamp_diff")}
                      />

                      <TextWithLabelPopover
                        fieldId="compression-type"
                        btnAriaLabel={t("topic.compression_type")}
                        fieldLabel={t("topic.compression_type")}
                        fieldValue="Producer"
                        popoverBody={t("topic.compression_type_description")}
                        popoverHeader={t("topic.compression_type")}
                      />

                      <TextWithLabelPopover
                        fieldId="message-format"
                        btnAriaLabel={t("topic.message_format")}
                        fieldLabel={t("topic.message_format")}
                        fieldValue="2.7-IV2"
                        popoverBody={t("topic.message_format_description")}
                        popoverHeader={t("topic.message_format")}
                      />
                    </FormSection>
                    <FormSection
                      title={t("topic.log")}
                      id="log"
                      titleElement={"h2"}
                    >
                      <TextContent>
                        <Text component={TextVariants.p}>
                          {t("topic.log_section_info")}
                          <Text
                            component={TextVariants.small}
                            className="section-info-note"
                          >
                            {t("topic.log_section_info_note")}
                          </Text>
                        </Text>
                      </TextContent>

                      <TextWithLabelPopover
                        fieldId="cleanup-policy"
                        btnAriaLabel={t("topic.cleanup_policy")}
                        fieldLabel={t("topic.cleanup_policy")}
                        fieldValue={topic["cleanup.policy"]}
                        popoverBody={t("topic.cleanup_policy_description")}
                        popoverHeader={t("topic.cleanup_policy")}
                      />

                      <TextWithLabelPopover
                        fieldId="delete-retention-time"
                        btnAriaLabel={t("topic.delete_retention_time")}
                        fieldLabel={t("topic.delete_retention_time")}
                        fieldValue={DEFAULT_DELETE_RETENTION_TIME}
                        popoverBody={t(
                          "topic.delete_retention_time_description"
                        )}
                        popoverHeader={t("topic.delete_retention_time")}
                      />

                      <TextWithLabelPopover
                        fieldId="min-cleanable-ratio"
                        btnAriaLabel={t("topic.min_cleanable_ratio")}
                        fieldLabel={t("topic.min_cleanable_ratio")}
                        fieldValue={DEFAULT_MIN_CLEANBLE_RATIO}
                        popoverBody={t("topic.min_cleanable_ratio_description")}
                        popoverHeader={t("topic.min_cleanable_ratio")}
                      />

                      <TextWithLabelPopover
                        fieldId="min-compaction-lag-time"
                        btnAriaLabel={t("topic.min_compaction_lag_time")}
                        fieldLabel={t("topic.min_compaction_lag_time")}
                        fieldValue={DEFAULT_MINIMUM_COMPACTION_LAG_TIME}
                        popoverBody={t(
                          "topic.min_compaction_lag_time_description"
                        )}
                        popoverHeader={t("topic.min_compaction_lag_time")}
                      />
                    </FormSection>
                    <FormSection
                      title={t("topic.replication")}
                      id="replication"
                      titleElement={"h2"}
                    >
                      <TextContent>
                        <Text component={TextVariants.p}>
                          {t("topic.replication_section_info")}
                          <Text component={TextVariants.small}>
                            {t("topic.replication_section_info_note")}
                          </Text>
                        </Text>
                      </TextContent>

                      <TextWithLabelPopover
                        fieldId="unclean-leader-election"
                        btnAriaLabel={t("topic.unclean_leader_election")}
                        fieldLabel={t("topic.unclean_leader_election")}
                        fieldValue={t("common.disabled")}
                        popoverBody={t(
                          "topic.unclean_leader_election_description"
                        )}
                        popoverHeader={t("topic.unclean_leader_election")}
                      />
                    </FormSection>

                    <FormSection
                      title={t("common.cleanup")}
                      id="cleanup"
                      titleElement={"h2"}
                    >
                      <TextContent>
                        <Text
                          component={TextVariants.p}
                          className="section-info"
                        >
                          {t("topic.cleanup_section_info")}
                        </Text>
                      </TextContent>

                      <TextWithLabelPopover
                        fieldId="log-segment-size"
                        btnAriaLabel={t("topic.log_segment_size")}
                        fieldLabel={t("topic.log_segment_size")}
                        fieldValue={DEFAULT_LOG_SEGMENT_SIZE}
                        popoverBody={t("topic.log_segment_size_description")}
                        popoverHeader={t("topic.log_segment_size")}
                      />

                      <TextWithLabelPopover
                        fieldId="segement-time"
                        btnAriaLabel={t("topic.segement_time")}
                        fieldLabel={t("topic.segement_time")}
                        fieldValue={DEFAULT_SEGMENT_TIME}
                        popoverBody={t("topic.segement_time_description")}
                        popoverHeader={t("topic.segement_time")}
                      />

                      <TextWithLabelPopover
                        fieldId="segment-jitter-time"
                        btnAriaLabel={t("topic.segment_jitter_time")}
                        fieldLabel={t("topic.segment_jitter_time")}
                        fieldValue={DEFAULT_SEGMENT_JITTER_TIME}
                        popoverBody={t("topic.segment_jitter_time_description")}
                        popoverHeader={t("topic.segment_jitter_time")}
                      />

                      <TextWithLabelPopover
                        fieldId="file-delete-delay"
                        btnAriaLabel={t("topic.file_delete_delay")}
                        fieldLabel={t("topic.file_delete_delay")}
                        fieldValue={DEFAULT_FILE_DELETE_DELAY}
                        popoverBody={t("topic.file_delete_delay_description")}
                        popoverHeader={t("topic.file_delete_delay")}
                      />

                      <TextWithLabelPopover
                        fieldId="preallocate-log-segment-files"
                        btnAriaLabel={t("topic.preallocate_log_segment_files")}
                        fieldLabel={t("topic.preallocate_log_segment_files")}
                        fieldValue={t("common.disabled")}
                        popoverBody={t(
                          "topic.preallocate_log_segment_files_description"
                        )}
                        popoverHeader={t("topic.preallocate_log_segment_files")}
                      />
                    </FormSection>
                    <FormSection
                      title={t("topic.index")}
                      id="index"
                      titleElement={"h2"}
                    >
                      <TextContent>
                        <Text
                          component={TextVariants.p}
                          className="section-info"
                        >
                          {t("topic.index_section_info")}
                        </Text>
                      </TextContent>

                      <TextWithLabelPopover
                        fieldId="index-interval-size"
                        btnAriaLabel={t("topic.index_interval_size")}
                        fieldLabel={t("topic.index_interval_size")}
                        fieldValue={DEFAULT_INDEX_INTERVAL_SIZE}
                        popoverBody={t("topic.index_interval_size_description")}
                        popoverHeader={t("topic.index_interval_size")}
                      />

                      <TextWithLabelPopover
                        fieldId="segment-index-size"
                        btnAriaLabel={t("topic.segment_index_size")}
                        fieldLabel={t("topic.segment_index_size")}
                        fieldValue={DEFAULT_SEGMENT_INDEX_SIZE}
                        popoverBody={t("topic.segment_index_size_description")}
                        popoverHeader={t("topic.segment_index_size")}
                      />
                    </FormSection>
                    <FormSection
                      title={t("topic.flush")}
                      id="flush"
                      titleElement={"h2"}
                    >
                      <TextContent>
                        <Text
                          component={TextVariants.p}
                          className="section-info"
                        >
                          {t("topic.flush_section_info")}
                        </Text>
                      </TextContent>

                      <TextWithLabelPopover
                        fieldId="flush-interval-messages"
                        btnAriaLabel={t("topic.flush_interval_messages")}
                        fieldLabel={t("topic.flush_interval_messages")}
                        fieldValue={DEFAULT_FLUSH_INTERVAL_MESSAGES}
                        popoverBody={t(
                          "topic.flush_interval_messages_description"
                        )}
                        popoverHeader={t("topic.flush_interval_messages")}
                      />

                      <TextWithLabelPopover
                        fieldId="flush-interval-time"
                        btnAriaLabel={t("topic.flush_interval_time")}
                        fieldLabel={t("topic.flush_interval_time")}
                        fieldValue={DEFAULT_FLUSH_INTERVAL_TIME}
                        popoverBody={t("topic.flush_interval_time_description")}
                        popoverHeader={t("topic.flush_interval_time")}
                      />
                    </FormSection>
                  </Form>

                  <Divider className='kafka-ui-divider__Margin' />

                  <TextContent>
                    <Text
                      component={TextVariants.h2}
                      tabIndex={-1}
                      id='delete'
                    >
                      {t('topic.delete_topic')}
                    </Text>
                    <Text component={TextVariants.p} className='section-info'>
                      {t('topic.delete_topic_info')}
                    </Text>
                    <Button
                      variant='danger'
                      onClick={deleteTopic}
                      data-testid='tabProperties-actionDelete'
                    >
                      {t('common.delete_topic')}
                    </Button>
                  </TextContent>

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
