import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { ConsumerGroupState as ConsumerGroupStateEnum } from '@rhoas/kafka-instance-sdk';

export const ConsumerGroupState: VFC<{
  state: ConsumerGroupStateEnum | undefined;
}> = ({ state }) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  switch (state) {
    case ConsumerGroupStateEnum.Stable:
      return <>{t('consumerGroup.state.stable')}</>;
    case ConsumerGroupStateEnum.Empty:
      return <>{t('consumerGroup.state.empty')}</>;
    case ConsumerGroupStateEnum.Dead:
      return <>{t('consumerGroup.state.dead')}</>;
    case ConsumerGroupStateEnum.CompletingRebalance:
      return <>{t('consumerGroup.state.completing_rebalance')}</>;
    case ConsumerGroupStateEnum.PreparingRebalance:
      return <>{t('consumerGroup.state.preparing_rebalance')}</>;
    case ConsumerGroupStateEnum.Unknown:
      return <>{t('consumerGroup.state.unknown')}</>;
    default:
      return <></>;
  }
};
