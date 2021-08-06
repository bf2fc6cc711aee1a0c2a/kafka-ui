import React, { useContext, useEffect, useState } from "react";
import { Modal, ModalVariant, Button, Alert, Checkbox, DropdownItem, Dropdown, DropdownToggle, Grid, GridItem, TextVariants, Title, TextInput } from "@patternfly/react-core";
import { useTranslation } from 'react-i18next';
import { ConfigContext } from "@app/contexts";
import { IRowData, Table, TableBody, TableHeader } from "@patternfly/react-table";
import { ConsumerGroup, ConsumerGroupResetOffsetParametersOffsetEnum } from "@rhoas/kafka-instance-sdk";
import './ConsumerGroupResetOffset.css';
import { BaseModalProps } from "@app/components/KafkaModal/ModalTypes";
import { consumerGroupResetOffset } from "@app/services";
import { DropdownWithToggle, IDropdownOption } from "@app/components/DropdownWithToggle";

export type ConsumerGroupResetOffsetProps = {
  // TODO: To be removed after sdk update
  consumerGroupData: ConsumerGroup & { state: string } | undefined;
  refreshConsumerGroups?: () => void;
}

const ConsumerGroupResetOffset: React.FC<ConsumerGroupResetOffsetProps & BaseModalProps> = ({ consumerGroupData, refreshConsumerGroups, hideModal }) => {


  const config = useContext(ConfigContext);

  const { t } = useTranslation();

  const [confirmCheckboxChecked, setConfirmCheckboxChecked] = useState<boolean>(false);
  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedOffset, setOffset] = useState<ConsumerGroupResetOffsetParametersOffsetEnum>();
  const [customOffsetValue, setCustomOffsetValue] = useState<string>("");

  const [isTopicOptionsOpen, setIsTopicOptionsOpen] = useState<boolean>(false);
  const [isOffsetsOptionOpen, setIsOffsetsOptionOpen] = useState<boolean>(false);

  const onCustomOffsetChange = (value: string) => {
    setCustomOffsetValue(value);
  }

  const preparedTableCells = () => {
    const tableRow: (IRowData | string[])[] | undefined = [];
    consumers && consumers.forEach((row, index) => {
      const { partition, groupId, memberId, offset: currentOffset, logEndOffset, lag, selected } = row;
      tableRow.push({
        cells: [
          partition,
          groupId + memberId,
          currentOffset,
          logEndOffset,
          lag,
          {
            title: (
              selected && selectedOffset ?
                (selectedOffset === ConsumerGroupResetOffsetParametersOffsetEnum.Absolute || selectedOffset === ConsumerGroupResetOffsetParametersOffsetEnum.Timestamp) ? customOffsetValue : selectedOffset : '-'
            )
          }
        ],
        originalData: row,
        selected
      })
    });
    return tableRow;
  }

  const getTopics = (consumerGroupDetail) => {

    const topics = consumerGroupDetail.consumers
      .map((consumer) => (consumer.topic));
    const distinctTopics = topics.filter((topic, i) => topics.indexOf(topic) === i);
    return distinctTopics
      .map((topic, index) => (
        {
          key: topic,
          value: topic,
          isDisabled: false,
        }
        )
      );
  }

  const offsetOptions: IDropdownOption[] = [
    {
      key: ConsumerGroupResetOffsetParametersOffsetEnum.Timestamp,
      value: ConsumerGroupResetOffsetParametersOffsetEnum.Timestamp,
      isDisabled: false,
    },
    {
      key: ConsumerGroupResetOffsetParametersOffsetEnum.Absolute,
      value: ConsumerGroupResetOffsetParametersOffsetEnum.Absolute,
      isDisabled: false,
    },
    {
      key: ConsumerGroupResetOffsetParametersOffsetEnum.Latest,
      value: ConsumerGroupResetOffsetParametersOffsetEnum.Latest,
      isDisabled: false,
    },
    {
      key: ConsumerGroupResetOffsetParametersOffsetEnum.Earliest,
      value: ConsumerGroupResetOffsetParametersOffsetEnum.Earliest,
      isDisabled: false,
    },
  ];

  useEffect(() => {
    const filteredConsumers = consumerGroupData && consumerGroupData.consumers.filter(consumer => consumer.topic === selectedTopic)
    setConsumers(filteredConsumers);
  }, [selectedTopic]);

  useEffect(() => {
    consumerGroupData && setIsDisconnected(getIsDisconnected(consumerGroupData.state))
  }, [consumerGroupData?.state])

  const onConfirmationChange = (checked: boolean) => {
    setConfirmCheckboxChecked(checked);
  };

  const getIsDisconnected = (state: string) => {
    if (state === 'STABLE') {
      return false;
    }
    return true;
  }

  const onClose = () => {
    hideModal();
  };

  const columns = [
    t('consumerGroup.partition'),
    `${t('consumerGroup.client_id')} + ${t('consumerGroup.member_id')}`,
    t('consumerGroup.current_offset'),
    t('consumerGroup.log_end_offset'),
    t('consumerGroup.offset_lag'),
    t('consumerGroup.new_offset'),
  ];

  const onTopicSelect = (_: string, event) => {
    setSelectedTopic(event.currentTarget.textContent);
    setIsTopicOptionsOpen(false);
  }

  const onOffsetSlect = (_: string, event) => {
    setOffset(event.currentTarget.textContent);
    setIsOffsetsOptionOpen(false);
  }

  const [consumers, setConsumers] = useState<any>([]);

  const handleConsumerGroupResetOffset = () => {
    const partitions = consumers.filter(({ selected }) => selected === true).map(({ partition }) => partition);
    if (selectedOffset === ConsumerGroupResetOffsetParametersOffsetEnum.Absolute || selectedOffset === ConsumerGroupResetOffsetParametersOffsetEnum.Timestamp) {
      consumerGroupData && consumerGroupResetOffset(config, consumerGroupData.groupId, ConsumerGroupResetOffsetParametersOffsetEnum.Absolute, selectedTopic, partitions, customOffsetValue.toString());
    } else {
      consumerGroupData && selectedOffset && consumerGroupResetOffset(config, consumerGroupData.groupId, selectedOffset, selectedTopic, partitions);
    }
    onClose();
  }

  const onSelect = (_: React.FormEvent<HTMLInputElement>, isSelected: boolean, rowId: number) => {
    let newConsumers = [...consumers];
    if (rowId === -1) {
      newConsumers = consumers.map(consumer => {
        consumer.selected = isSelected
        return consumer;
      });
    } else {
      newConsumers[rowId].selected = isSelected;
    }
    setConsumers(newConsumers);
  }

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={true}
      aria-label={'Modal for resetting offset of Kafka consumergroup'}
      title={t('consumerGroup.reset_offset')}
      showClose={true}
      aria-describedby='modal-message'
      onClose={onClose}
      actions={[
        <Button
          variant='danger'
          onClick={handleConsumerGroupResetOffset}
          key={1}
          isDisabled={selectedTopic === '' || !confirmCheckboxChecked || isDisconnected || !selectedOffset || consumers.filter(({ selected }) => selected === true).length === 0}
        >
          {t('consumerGroup.reset_offset')}
        </Button>,
        <Button variant='link' onClick={onClose} key={2}>
          {t('common.cancel')}
        </Button>,
      ]}
    >
      <Grid>
        <GridItem span={2} className='reset-offset__griditem'>
          <Title headingLevel="h4" size="md">
            Consumer group
          </Title>
        </GridItem>
        <GridItem span={10} className='info-grid'>
          {consumerGroupData?.groupId}
        </GridItem>
        {!isDisconnected && (
          <>
            <GridItem span={2} className='reset-offset__griditem'>
              <Title headingLevel="h4" size="md">
                Topic
              </Title>
            </GridItem>
            <GridItem span={10}>
              <DropdownWithToggle
                id="topic-dropdown"
                toggleId='topic-dropdowntoggle'
                ariaLabel='topic-select-dropdown'
                onSelectOption={onTopicSelect}
                items={getTopics(consumerGroupData)}
                name='cleanup-policy'
                value={selectedTopic ? selectedTopic : 'Select'}
              />
            </GridItem>
          </>)}
        {!isDisconnected && selectedTopic !== '' && (<>
          <GridItem span={2} className='reset-offset__griditem'>
            <Title headingLevel="h4" size="md">
              New offset
            </Title>
          </GridItem>
          <GridItem span={10}>
            <DropdownWithToggle
              id='offset-dropdown'
              toggleId='offset-dropdowntoggle'
              ariaLabel='offset-select-dropdown'
              onSelectOption={onOffsetSlect}
              items={offsetOptions}
              name='cleanup-policy'
              value={selectedOffset ? selectedOffset : 'Select'}
            />
          </GridItem>
        </>)}
        {!isDisconnected && selectedTopic !== '' && (selectedOffset === ConsumerGroupResetOffsetParametersOffsetEnum.Absolute || selectedOffset === ConsumerGroupResetOffsetParametersOffsetEnum.Timestamp) && (<>
          <GridItem span={2} className='reset-offset__griditem'>
            <Title headingLevel="h4" size="md">
              Custom offset
            </Title>
          </GridItem>
          <GridItem span={10}>
            <TextInput id="custom-offset-input" value={customOffsetValue} onChange={onCustomOffsetChange} />
          </GridItem>
        </>)}
      </Grid>
      {isDisconnected && <Alert
        className='modal-alert'
        variant='danger'
        isInline
        title={'The offset for this consumer group cannot be reset at this time'}
      >
        <p>
          One or more members of the consumer group are currently connected to a topic.
          All members of a consumer group must be disconnected before resetting the offset.
        </p>
      </Alert>}

      {
        !isDisconnected && consumers?.length > 0 && selectedTopic !== '' &&
        (
          <>
            <Table
              onSelect={onSelect}
              canSelectAll={true}
              aria-label="Selectable Table"
              cells={columns}
              rows={preparedTableCells()}
              className='consumer-table'
            >
              <TableHeader />
              <TableBody />
            </Table>
            <Checkbox label="I understand that by resetting the offset position, I risk clients skipping or duplicating messages." aria-label="uncontrolled checkbox example" id="check-5" isChecked={confirmCheckboxChecked} onChange={onConfirmationChange} />
          </>
        )
      }
    </Modal>

  )
}

export default ConsumerGroupResetOffset;