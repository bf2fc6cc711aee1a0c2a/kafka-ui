import { AxiosResponse } from 'axios';
import { AdvancedTopic } from '../Contexts/Topic';
import { DefaultApi, Topic, TopicSettings, TopicsList } from '../OpenApi/api';
import { Configuration } from '../OpenApi';
import { IConfiguration } from '../Contexts';

export const getTopics = async (
  config: IConfiguration | undefined
): Promise<TopicsList> => {
  const accessToken = await config?.getToken();

  const api = new DefaultApi(
    new Configuration({
      accessToken,
      basePath: config?.basePath,
    })
  );
  const response: AxiosResponse<TopicsList> = await api.getTopicsList();
  return response.data;
};

export const getTopicDetail = async (
  topicName: string,
  config: IConfiguration | undefined
): Promise<AdvancedTopic> => {
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

const convertTopicResponse = (topic: Topic): AdvancedTopic => {
  const topicObj: any = {};

  topic.config?.forEach((config) => {
    if (config.key) {
      topicObj[config.key] = config.value;
    }
  });

  topicObj.numPartitions = topic?.partitions?.length;

  topicObj.replicationFactor = topic?.partitions
    ?.map((p) => p.replicas?.length)
    .reduce(
      (previousValue = 0, currentValue = 0) => previousValue + currentValue
    );

  return topicObj;
};

export const updateTopicModel = async (
  topicName: string,
  topicSettings: TopicSettings,
  config: IConfiguration | undefined
): Promise<Topic> => {
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
  return response.data;
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
