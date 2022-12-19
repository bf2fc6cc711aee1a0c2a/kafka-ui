import { AxiosResponse } from 'axios';
import {
  Configuration,
  ConsumerGroupList,
  OffsetType,
  ConsumerGroupResetOffsetResult,
  GroupsApi,
  ConsumerGroupOrderKey,
  ConsumerGroupState,
  ConsumerGroup as ConsumerGroupDetail,
} from '@rhoas/kafka-instance-sdk';
import { IConfiguration } from '@app/contexts';
import {
  ConsumerGroup,
  SortDirection,
} from '@rhoas/app-services-ui-components';

const getConsumerGroups = async (
  config: IConfiguration | undefined,
  page?: number,
  perPage?: number,
  sort?: KafkaConsumerGroupSortableColumn,
  direction?: SortDirection,
  topic?: string,
  groupId?: string
): Promise<{ groups: ConsumerGroup[]; count: number }> => {
  const accessToken = await config?.getToken();

  const api = new GroupsApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const response: AxiosResponse<ConsumerGroupList> =
    await api.getConsumerGroups(
      undefined,
      undefined,
      perPage,
      page,
      topic,
      groupId,
      direction,
      sort
    );
  const groups = (response.data.items || []).map<ConsumerGroup>((t) => ({
    consumerGroupId: t.groupId || '',
    activeMembers: t.metrics?.activeConsumers || 0,
    partitionsWithLag: t.metrics?.laggingPartitions || 0,
    state: stateMapping[t.state as ConsumerGroupState],
  }));
  const count = response.data.total;
  return { count, groups };
};

const deleteConsumerGroup = async (
  consumerGroupId: string,
  config: IConfiguration | undefined
): Promise<void> => {
  const accessToken = await config?.getToken();

  const api = new GroupsApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  await api.deleteConsumerGroupById(consumerGroupId);
  return;
};

const getConsumerGroupDetail = async (
  consumerGroupId: string,
  config: IConfiguration | undefined
): Promise<ConsumerGroupDetail> => {
  const accessToken = await config?.getToken();

  const api = new GroupsApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const response: AxiosResponse<ConsumerGroupDetail> =
    await api.getConsumerGroupById(consumerGroupId);
  return response.data;
};

const consumerGroupResetOffset = async (
  config: IConfiguration | undefined,
  consumerGroupId: string,
  offset: OffsetType,
  topic: string,
  partitions: number[],
  value?: string
): Promise<AxiosResponse<ConsumerGroupResetOffsetResult>> => {
  const accessToken = await config?.getToken();

  const api = new GroupsApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const response: AxiosResponse<ConsumerGroupResetOffsetResult> =
    await api.resetConsumerGroupOffset(consumerGroupId, {
      value,
      offset,
      topics: [{ topic, partitions }],
    });
  return response;
};

export {
  getConsumerGroups,
  deleteConsumerGroup,
  getConsumerGroupDetail,
  consumerGroupResetOffset,
};

const stateMapping: { [state in ConsumerGroupState]: ConsumerGroup['state'] } =
  {
    DEAD: 'Dead',
    EMPTY: 'Empty',
    STABLE: 'Stable',
    UNKNOWN: 'Unknown',
    COMPLETING_REBALANCE: 'CompletingRebalance',
    PREPARING_REBALANCE: 'PreparingRebalance',
  };

export const KafkaConsumerGroupSortableColumns = [
  ...Object.values(ConsumerGroupOrderKey),
] as const;

export type KafkaConsumerGroupSortableColumn =
  typeof KafkaConsumerGroupSortableColumns[number];
