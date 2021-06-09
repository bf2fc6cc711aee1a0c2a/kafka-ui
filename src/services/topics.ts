import { AxiosResponse } from 'axios';
import {
  ConfigEntry,
  DefaultApi,
  Topic,
  TopicSettings,
  TopicsList,
} from '@rhoas/kafka-instance-sdk';
import { Configuration } from '@rhoas/kafka-instance-sdk';
import { IConfiguration } from '@app/contexts';
import { IAdvancedTopic } from '@app/modules/Topics/components/CreateTopicWizard/CreateTopicWizard';

export const getTopics = async (
  config: IConfiguration | undefined,
  filter?: string
): Promise<TopicsList> => {
  const accessToken = await config?.getToken();

  const api = new DefaultApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const response: AxiosResponse<TopicsList> = await api.getTopics(100, filter);
  return response.data;
};

export const getTopicDetail = async (
  topicName: string,
  config: IConfiguration | undefined
): Promise<IAdvancedTopic> => {
  const accessToken = await config?.getToken();

  const api = new DefaultApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const { data } = await api.getTopic(topicName);

  return convertTopicResponse(data);
};

const convertTopicResponse = (topic: Topic): IAdvancedTopic => {
  const topicObj: any = {};

  topicObj.name = topic.name;

  topic.config?.forEach((config) => {
    if (config.key) {
      topicObj[config.key] = config.value;
    }
  });

  topicObj.numPartitions = topic?.partitions?.length || 0;

  return topicObj;
};

export const updateTopicModel = async (
  topicName: string,
  topicSettings: TopicSettings,
  config: IConfiguration | undefined
): Promise<number> => {
  const accessToken = await config?.getToken();

  const api = new DefaultApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const response: AxiosResponse<Topic> = await api.updateTopic(
    topicName,
    topicSettings
  );
  return response.status;
};

export const getTopic = async (
  topicName: string,
  config: IConfiguration | undefined
): Promise<Topic> => {
  const accessToken = await config?.getToken();

  const api = new DefaultApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const response = await api.getTopic(topicName);

  const answer = response.data;
  answer.config = answer.config || ([] as ConfigEntry[]);
  answer.config.push({
    key: 'replicationFactor',
    value: response.data?.partitions
      ?.map((p) => p.replicas?.length)
      .reduce(
        (previousValue = 0, currentValue = 0) => previousValue + currentValue
      )
      ?.toString(),
  });
  return response.data;
};

export const deleteTopic = async (
  topicName: string,
  config: IConfiguration | undefined
): Promise<void> => {
  const accessToken = await config?.getToken();

  const api = new DefaultApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  await api.deleteTopic(topicName);
  return;
};
