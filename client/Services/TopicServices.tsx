/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { AxiosResponse } from 'axios';
import { AdvancedTopic2 } from 'Contexts/Topic';
import { DefaultApi, Topic, TopicSettings, TopicsList } from 'OpenApi/api';
import { Configuration } from 'OpenApi';


export const getTopics = async (config:Configuration, basePath: string): Promise<TopicsList> => {
  
  const topicListObj = new DefaultApi(config, basePath);
  const response: AxiosResponse<TopicsList> = await topicListObj.getTopicsList();
  return response.data;
};

export const getTopicDetail = async (
  topicName: string,
  config:Configuration, 
  basePath: string
): Promise<AdvancedTopic2> => {
  const { data } = await new DefaultApi(config, basePath).getTopic(topicName);

  return convertTopicResponse(data);
};

const convertTopicResponse = (topic: Topic): AdvancedTopic2 => {
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
  config:Configuration, 
  basePath: string
): Promise<Topic> => {
  const topicListObj = new DefaultApi(config, basePath);
  const response: AxiosResponse<Topic> = await topicListObj.updateTopic(
    topicName,
    topicSettings
  );
  return response.data;
};

export const getTopic = async (topicName: string, config:Configuration, basePath: string): Promise<Topic> => {
  const topicListObj = new DefaultApi(config, basePath);
  const response = await topicListObj.getTopic(topicName);
  return response.data;
};

export const deleteTopic = async (topicName: string, config:Configuration, basePath: string): Promise<void> => {
  const topicListObj = new DefaultApi(config, basePath);
  const response = await topicListObj.deleteTopic(topicName);
  return;
};
