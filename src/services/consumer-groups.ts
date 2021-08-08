import { AxiosResponse } from 'axios';
import {
  Configuration,
  GroupsApi,
  ConsumerGroupList,
  ConsumerGroup,
  ConsumerGroupResetOffsetParametersOffsetEnum,
} from '@rhoas/kafka-instance-sdk';
import { IConfiguration } from '@app/contexts';
import { SortByDirection } from '@patternfly/react-table';

const getConsumerGroups = async (
  config: IConfiguration | undefined,
  offset?: number,
  limit?: number,
  size?: number,
  page?: number,
  topic?: string,
  groupIdFilter?: string,
  order: SortByDirection = SortByDirection.asc,
  orderKey?: 'name' | undefined
): Promise<ConsumerGroupList> => {
  const accessToken = await config?.getToken();

  const api = new GroupsApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const response: AxiosResponse<ConsumerGroupList> =
    await api.getConsumerGroups(
      offset,
      limit,
      size,
      page,
      topic,
      groupIdFilter,
      order,
      orderKey
    );
  return response.data;
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
): Promise<ConsumerGroup> => {
  const accessToken = await config?.getToken();

  const api = new GroupsApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const response: AxiosResponse<ConsumerGroup> = await api.getConsumerGroupById(
    consumerGroupId
  );
  return response.data;
};

const consumerGroupResetOffset = async (
  config: IConfiguration | undefined,
  consumerGroupId: string,
  offset: ConsumerGroupResetOffsetParametersOffsetEnum,
  topic: string,
  partitions: number[],
  value?: string,
): Promise<AxiosResponse<any[][]>> => {
  const accessToken = await config?.getToken();

  const api = new DefaultApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const response: AxiosResponse<any[][]> = await api.resetConsumerGroupOffset(
    consumerGroupId,
    { value, offset, topics: [{ topic, partitions }]}
  );
  return response;
};

export { getConsumerGroups, deleteConsumerGroup, getConsumerGroupDetail, consumerGroupResetOffset };
