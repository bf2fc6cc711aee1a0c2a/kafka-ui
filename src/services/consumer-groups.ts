import { AxiosResponse } from 'axios';

import { DefaultApi, ConsumerGroupList, ConsumerGroup } from '@app/openapi/api';
import { Configuration } from '@app/openapi';
import { IConfiguration } from '@app/contexts';

export const getConsumerGroups = async (
  config: IConfiguration | undefined,
  limit?: number,
  offset?: number,
  topic?: string
): Promise<ConsumerGroupList> => {
  const accessToken = await config?.getToken();

  const api = new DefaultApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const response: AxiosResponse<ConsumerGroupList> = await api.getConsumerGroupList(
    limit,
    offset,
    topic
  );
  return response.data;
};

export const deleteConsumerGroup = async (
  consumerGroupId: string,
  config: IConfiguration | undefined
): Promise<void> => {
  const accessToken = await config?.getToken();

  const api = new DefaultApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  await api.deleteConsumerGroupById(consumerGroupId);
  return;
};
export const getConsumerGroupDetail = async (
  consumerGroupId: string,
  config: IConfiguration | undefined
): Promise<ConsumerGroup> => {
  const accessToken = await config?.getToken();

  const api = new DefaultApi(
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
export const getConsumerGroupsByTopic = async (
  config: IConfiguration | undefined,
  limit: number,
  offset: number,
  topic: string
): Promise<ConsumerGroupList> => {
  const accessToken = await config?.getToken();

  const api = new DefaultApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const response: AxiosResponse<ConsumerGroupList> = await api.getConsumerGroupList(
    limit,
    offset,
    topic
  );
  return response.data;
};
