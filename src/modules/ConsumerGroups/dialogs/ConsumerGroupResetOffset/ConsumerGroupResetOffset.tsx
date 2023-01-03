import React, { useContext, useEffect, useState } from 'react';
import { AlertVariant } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { ConfigContext } from '@app/contexts';
import { OffsetType } from '@rhoas/kafka-instance-sdk';
import { consumerGroupResetOffset } from '@app/services';
import { isAxiosError } from '@app/utils/axios';
import {
  BaseModalProps,
  ConsumerGroupResetOffsetProps,
  useAlert,
} from '@rhoas/app-services-ui-shared';
import {
  ConsumerGroupResetOffset,
  ConsumerRow,
  OffsetValue,
} from '@rhoas/app-services-ui-components';

const ResetOffsetConsumerGroup: React.FC<
  ConsumerGroupResetOffsetProps & BaseModalProps
> = ({ consumerGroupData, refreshConsumerGroups, hideModal }) => {
  const config = useContext(ConfigContext);

  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  const [confirmCheckboxChecked, setConfirmCheckboxChecked] =
    useState<boolean>(false);
  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedOffset, setOffset] = useState<OffsetValue>('absolute');
  const [customOffsetValue, setCustomOffsetValue] = useState<string>('');

  const [isConsumerSelected, setIsConsumerSelected] = useState<boolean>(false);

  const [consumers, setConsumers] = useState<ConsumerRow[]>([]);

  const { addAlert } = useAlert() || {
    addAlert: () => {
      // No-op
    },
  };

  const onCustomOffsetChange = (value: string) => {
    setCustomOffsetValue(value);
  };

  const getTopics = () => {
    const topics = (consumerGroupData?.consumers || []).map(
      (consumer) => consumer.topic
    );
    const distinctTopics = [...new Set(topics)];
    return distinctTopics;
  };

  useEffect(() => {
    consumerGroupData?.state &&
      setIsDisconnected(getIsDisconnected(consumerGroupData.state));
  }, [consumerGroupData?.state]);

  const getIsDisconnected = (state: string) => {
    return state !== 'Stable';
  };

  useEffect(() => {
    const filteredConsumers =
      consumerGroupData &&
      consumerGroupData.consumers.filter(
        (consumer) => consumer.topic === selectedTopic
      );
    setConsumers(filteredConsumers || []);
  }, [consumerGroupData, selectedTopic]);

  const onConfirmationChange = (checked: boolean) => {
    setConfirmCheckboxChecked(checked);
  };

  const onClose = () => {
    hideModal();
  };

  const onTopicSelect = (value: string) => {
    setSelectedTopic(value);
  };

  const onOffsetSelect = (value: string) => {
    setOffset(value as OffsetValue);
  };

  const onSelectAllConsumer = (isSelecting = true) => {
    setIsConsumerSelected(isSelecting);
    setConsumers(
      consumers.map((consumer) => {
        consumer.selected = isSelecting;
        return consumer;
      })
    );
  };

  const onSelectRow = (rowId: number, selecting: boolean) => {
    setIsConsumerSelected(false);
    const selectedConsumers = [...consumers];
    selectedConsumers[rowId].selected = !selecting;
    setIsConsumerSelected(!selecting);
    setConsumers(selectedConsumers);
  };

  const handleConsumerGroupResetOffset = async () => {
    try {
      const partitions = consumers
        .filter(({ selected }) => selected === true)
        .map(({ partition }) => partition);
      if (selectedOffset === OffsetType.Absolute) {
        consumerGroupData &&
          (await consumerGroupResetOffset(
            config,
            consumerGroupData.groupId,
            OffsetType.Absolute,
            selectedTopic,
            partitions,
            customOffsetValue.toString()
          ));
      } else {
        consumerGroupData &&
          selectedOffset &&
          (await consumerGroupResetOffset(
            config,
            consumerGroupData.groupId,
            selectedOffset,
            selectedTopic,
            partitions
          ));
      }
      addAlert({
        variant: AlertVariant.success,
        title: t('consumerGroup.offset_successfully_reset'),
      });
      refreshConsumerGroups && refreshConsumerGroups();
    } catch (err) {
      let message: string | undefined;
      if (err && isAxiosError(err)) {
        message = err.response?.data.error_message;
      }
      addAlert({
        variant: AlertVariant.danger,
        title: message || '',
      });
    }
    onClose();
  };

  return (
    <ConsumerGroupResetOffset
      isModalOpen={true}
      isDisconnected={isDisconnected}
      groupId={consumerGroupData?.groupId ? consumerGroupData?.groupId : ''}
      topics={getTopics()}
      selectedTopic={selectedTopic}
      customOffsetValue={customOffsetValue}
      setcustomOffsetValue={onCustomOffsetChange}
      consumers={consumers}
      isSelected={isConsumerSelected}
      onClickClose={hideModal}
      onClickResetOffset={handleConsumerGroupResetOffset}
      onChangeTopic={onTopicSelect}
      selectedOffset={selectedOffset}
      onChangeOffsetValue={onOffsetSelect}
      confirmCheckboxChecked={confirmCheckboxChecked}
      onConfirmationChange={onConfirmationChange}
      onSelectAll={onSelectAllConsumer}
      onSelectRow={onSelectRow}
    />
  );
};

export default ResetOffsetConsumerGroup;
