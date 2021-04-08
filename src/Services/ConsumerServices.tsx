import { AxiosResponse } from 'axios';

import { DefaultApi, ConsumerGroupList } from '../OpenApi/api';
import { Configuration } from '../OpenApi';
import { IConfiguration } from '../Contexts';

export const getConsumers = async (
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

export const deleteConsumer = async (
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
