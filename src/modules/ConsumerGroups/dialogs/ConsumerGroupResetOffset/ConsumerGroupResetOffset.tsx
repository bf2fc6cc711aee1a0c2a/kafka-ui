import React, { useContext, useEffect, useState } from "react";
import { Modal, ModalVariant, Button, Alert, Checkbox, Title, TextInput, AlertVariant, Form, FormGroup, Stack, StackItem } from "@patternfly/react-core";
import { useTranslation } from 'react-i18next';
import { ConfigContext } from "@app/contexts";
import { IRowData, Table, TableBody, TableHeader } from "@patternfly/react-table";
import { Consumer, ConsumerGroup, ConsumerGroupResetOffsetParametersOffsetEnum, ConsumerGroupStateEnum } from "@rhoas/kafka-instance-sdk";
import './ConsumerGroupResetOffset.css';
import { BaseModalProps } from "@app/components/KafkaModal/ModalTypes";
import { consumerGroupResetOffset } from "@app/services";
import { DropdownWithToggle, IDropdownOption } from "@app/components/DropdownWithToggle";
import { useAlert } from "@bf2/ui-shared";

export type ConsumerGroupResetOffsetProps = {
  consumerGroupData: ConsumerGroup | undefined;
  refreshConsumerGroups?: () => void;
}

export type ConsumerRow = Consumer & {
  selected?: boolean;
}

const ConsumerGroupResetOffset: React.FC<ConsumerGroupResetOffsetProps & BaseModalProps> = ({ consumerGroupData, refreshConsumerGroups, hideModal }) => {

  const config = useContext(ConfigContext);

  const { t } = useTranslation();

  const [confirmCheckboxChecked, setConfirmCheckboxChecked] = useState<boolean>(false);
  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedOffset, setOffset] = useState<ConsumerGroupResetOffsetParametersOffsetEnum>();
  const [customOffsetValue, setCustomOffsetValue] = useState<string>("");
  const [consumers, setConsumers] = useState<ConsumerRow[]>([]);
  const { addAlert } = useAlert();

  const onCustomOffsetChange = (value: string) => {
    setCustomOffsetValue(value);
  };

  const preparedTableCells = () => {
    const tableRow: (IRowData | string[])[] | undefined = [];
    consumers && consumers.forEach((row: ConsumerRow) => {
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
                selectedOffset === ConsumerGroupResetOffsetParametersOffsetEnum.Absolute ? customOffsetValue : selectedOffset : '-'
            )
          }
        ],
        originalData: row,
        selected
      });
    });
    return tableRow;
  };

  const getTopics = (consumerGroupDetail) => {

    const topics = consumerGroupDetail.consumers
      .map((consumer) => (consumer.topic));
    const distinctTopics = topics.filter((topic: string, i: number) => topics.indexOf(topic) === i);
    return distinctTopics
      .map((topic: string) => (
        {
          key: topic,
          value: topic,
          isDisabled: false,
        }
      )
      );
  };

  const offsetOptions: IDropdownOption[] = [
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
    const filteredConsumers = consumerGroupData && consumerGroupData.consumers.filter(consumer => consumer.topic === selectedTopic);
    setConsumers(filteredConsumers || []);
  }, [selectedTopic]);

  useEffect(() => {
    consumerGroupData?.state && setIsDisconnected(getIsDisconnected(consumerGroupData.state));
  }, [consumerGroupData?.state]);

  const onConfirmationChange = (checked: boolean) => {
    setConfirmCheckboxChecked(checked);
  };

  const getIsDisconnected = (state: string) => {
    if (state===ConsumerGroupStateEnum.Stable) {
      return false;
    }
    return true;
  };

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
  };

  const onOffsetSlect = (_: string, event) => {
    setOffset(event.currentTarget.textContent);
  };

  const handleConsumerGroupResetOffset = async () => {
    try {
      const partitions = consumers.filter(({ selected }) => selected === true).map(({ partition }) => partition);
      if (selectedOffset === ConsumerGroupResetOffsetParametersOffsetEnum.Absolute) {
        consumerGroupData && await consumerGroupResetOffset(config, consumerGroupData.groupId, ConsumerGroupResetOffsetParametersOffsetEnum.Absolute, selectedTopic, partitions, customOffsetValue.toString());
      } else {
        consumerGroupData && selectedOffset && await consumerGroupResetOffset(config, consumerGroupData.groupId, selectedOffset, selectedTopic, partitions);
      }
      addAlert({
        variant: AlertVariant.success,
        title: t('consumerGroup.offset_successfully_reset'),
      });
      refreshConsumerGroups && refreshConsumerGroups();
    } catch (err) {
      addAlert({
        variant: AlertVariant.danger,
        title: err?.response?.data?.error_message,
      });
    }

    onClose();
  };

  const onSelect = (_: React.FormEvent<HTMLInputElement>, isSelected: boolean, rowId: number) => {
    let newConsumers = [...consumers];
    if (rowId === -1) {
      newConsumers = consumers.map(consumer => {
        consumer.selected = isSelected;
        return consumer;
      });
    } else {
      newConsumers[rowId].selected = isSelected;
    }
    setConsumers(newConsumers);
  };

  const isResetOffsetDisabled = (): boolean => {
    return (selectedTopic === '' || !confirmCheckboxChecked || !isDisconnected || !selectedOffset || consumers.filter(({ selected }) => selected === true).length === 0);
  };

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
          isDisabled={isResetOffsetDisabled()}
        >
          {t('consumerGroup.reset_offset')}
        </Button>,
        <Button variant='link' onClick={onClose} key={2}>
          {t('common.cancel')}
        </Button>,
      ]}
    >
      <Stack hasGutter>
        <StackItem>
          <Form isHorizontal>
            <FormGroup label="Consumer group" fieldId="horizontal-form-name">
              <Title className="form-title" headingLevel="h4" size="md">{consumerGroupData?.groupId}</Title>
            </FormGroup>
            {isDisconnected && (<FormGroup label="Topic" fieldId="horizontal-form-name">
              <DropdownWithToggle
                id="topic-dropdown"
                toggleId='topic-dropdowntoggle'
                ariaLabel='topic-select-dropdown'
                onSelectOption={onTopicSelect}
                items={getTopics(consumerGroupData)}
                name='cleanup-policy'
                value={selectedTopic ? selectedTopic : t('common.select')}
                menuAppendTo={'parent'}
              />
            </FormGroup>)}
            {isDisconnected && selectedTopic && (
              <FormGroup label="New offset" fieldId="offset-dropdown">
                <DropdownWithToggle
                  id='offset-dropdown'
                  toggleId='offset-dropdowntoggle'
                  ariaLabel='offset-select-dropdown'
                  onSelectOption={onOffsetSlect}
                  items={offsetOptions}
                  name='offset-dropdown'
                  value={selectedOffset ? selectedOffset : t('common.select')}
                  menuAppendTo={'parent'}
                />
              </FormGroup>
            )}

            {isDisconnected && selectedTopic && (selectedOffset === ConsumerGroupResetOffsetParametersOffsetEnum.Absolute) && (
              <FormGroup label="Custom offset" fieldId="custom-offset-input">
                <TextInput id="custom-offset-input" value={customOffsetValue} onChange={onCustomOffsetChange} type="number" />
              </FormGroup>)}
          </Form>
        </StackItem>
        <StackItem>
          {!isDisconnected &&
            <Alert
              className='modal-alert'
              variant='danger'
              isInline
              title={t('consumerGroup.reset_offset_connected_alert_title')}
            >
              <p>
                {t('consumerGroup.reset_offset_connected_alert_body')}
              </p>
            </Alert>
          }
        </StackItem>
        <StackItem>
          {
            isDisconnected && consumers?.length > 0 && selectedTopic &&
            (
              <Stack hasGutter>
                <StackItem>
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
                </StackItem>
                <StackItem>
                  <Checkbox label={t('consumerGroup.reset_offset_accept')} aria-label="uncontrolled checkbox example" id="check-5" isChecked={confirmCheckboxChecked} onChange={onConfirmationChange} />
                </StackItem>
              </Stack>
            )
          }
        </StackItem>
      </Stack>
    </Modal>

  );
};

export default ConsumerGroupResetOffset;