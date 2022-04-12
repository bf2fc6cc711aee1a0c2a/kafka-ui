import { useTranslation } from 'react-i18next';
import { ConsumerGroupState as ConsumerGroupStateEnum } from '@rhoas/kafka-instance-sdk';

export const ConsumerGroupState = (
  state: ConsumerGroupStateEnum | undefined
) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  switch (state) {
    case ConsumerGroupStateEnum.Stable:
      return t('consumerGroup.stable_state');
    case ConsumerGroupStateEnum.Empty:
      return t('consumerGroup.empty_state');
    case ConsumerGroupStateEnum.Dead:
      return t('consumerGroup.dead_state');
    case ConsumerGroupStateEnum.CompletingRebalance:
      return t('consumerGroup.completing_rebalance_state');
    case ConsumerGroupStateEnum.PreparingRebalance:
      return t('consumerGroup.preparing_rebalance_state');
    case ConsumerGroupStateEnum.Unknown:
      return t('consumerGroup.unknown_state');
    default:
      return null;
  }
};
