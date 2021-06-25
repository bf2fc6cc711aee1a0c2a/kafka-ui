import { AxiosResponse } from 'axios';
import { Configuration, DefaultApi, ConsumerGroupList, ConsumerGroup } from '@rhoas/kafka-instance-sdk';
import { IConfiguration } from '@app/contexts';

const getConsumerGroups = async (
  config: IConfiguration | undefined,
  offset?:number,
  limit?:number,
  size?:number,
  page?:number,
  topic?:string,
  groupIdFilter?:string
): Promise<ConsumerGroupList> => {
  const accessToken = await config?.getToken();

  const api = new DefaultApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const response: AxiosResponse<ConsumerGroupList> = await api.getConsumerGroups(
    offset,
    limit,
    size,
    page,
    topic,
    groupIdFilter
  );
  return response.data;
};

const deleteConsumerGroup = async (
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

const getConsumerGroupDetail = async (
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

export {
  getConsumerGroups,
  deleteConsumerGroup,
  getConsumerGroupDetail
};
