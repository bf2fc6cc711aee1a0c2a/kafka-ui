/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { DefaultApi } from "../../OpenApi/api";

export const useTopicsModel = async () => {
  const topicListObj = new DefaultApi();
  const model=await topicListObj
    .getTopicsList();
  return {
    model,
  };
};

// TODO: move to a suitable file
const convertTopicResponse = (topic) => {
  let storeObj = {};

  topic.config.forEach(config => {
    storeObj[config.key] = config.value;
  });

  delete topic.config;

  topic.numPartitions = topic?.partitions?.length;

  topic.replicationFactor = topic?.partitions
    ?.map((p) => p.replicas.length)
    .reduce((previousValue, currentValue) => previousValue + currentValue),

  delete topic.partitions;

  topic = {...topic, ...storeObj};

  return topic;
}

export const useTopicDetail = async (topicName: string) => {
  const { data } = await new DefaultApi().getTopic(topicName);

  return convertTopicResponse(data);
}