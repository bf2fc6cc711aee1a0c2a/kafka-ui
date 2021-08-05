import { ConfigEntry, NewTopicInput } from '@rhoas/kafka-instance-sdk';
import { IAdvancedTopic } from '@app/modules/Topics/components/CreateTopicWizard';

const capitalizeText = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const kebabToCamel = function (kebabCase: string): string {
  const words: string[] = kebabCase.split('-');

  const camelCased: string[] = words.map((word: string, index: number) => {
    return index > 0 ? capitalizeText(word) : word;
  });

  return camelCased.join('');
};

export const kebabToDotSeparated = (val: string): string => {
  return val.replaceAll('-', '.');
};

const unitsToBytes = {
  bytes: 1,
  kibibytes: 1024,
  mebibytes: 1048576,
  gibibytes: 1073741824,
  tebibytes: 1.0995116e12,
};

const unitsToMilliSecond = {
  milliseconds: 1,
  seconds: 1000,
  days: 86400000,
  months: 2592000000,
  years: 31536000000,
};

export const convertUnits = (topicData: IAdvancedTopic): IAdvancedTopic => {
  const topic = { ...topicData };

  for (const key in topic) {
    if (key.split('.').pop() === 'ms') {
      topic[key] = String(
        Number(topic[key]) *
          unitsToMilliSecond[topic[`${key}.unit`] || 'milliseconds']
      );
    }
    if (key.split('.').pop() === 'bytes') {
      topic[key] = String(
        Number(topic[key]) * unitsToBytes[topic[`${key}.unit`] || 'bytes']
      );
    }
  }

  if (topic['flush.messages']) {
    topic['flush.messages'] = String(
      Number(topic['flush.messages']) *
        unitsToMilliSecond[topic['flush.messages.unit'] || 'milliseconds']
    );
  }

  for (const key in topic) {
    if (key.split('.').pop() === 'unit') {
      delete topic[key];
    }
  }

  return topic;
};

export const formatTopicRequest = (topic: IAdvancedTopic): NewTopicInput => {
  const { name, numPartitions, ...configEntries } = topic;

  const config: ConfigEntry[] = [];

  for (const key in configEntries) {
    if (key) {
      config.push({
        key,
        value: configEntries[key].toString(),
      });
    }
  }

  return {
    name,
    settings: {
      numPartitions: Number(numPartitions),
      config,
    },
  };
};
