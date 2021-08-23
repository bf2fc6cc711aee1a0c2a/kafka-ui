import { ConfigEntry, NewTopicInput } from '@rhoas/kafka-instance-sdk';
import { IAdvancedTopic } from '@app/modules/Topics/components/CreateTopicWizard';

type ConversionResponse = {
  value: number;
  unit: string;
}

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

export const determineTimeUnit = (retentionTime: number): ConversionResponse => {
  if (retentionTime % unitsToMilliSecond.years == 0) return { value: (retentionTime / unitsToMilliSecond.years), unit: 'years' }
  if (retentionTime % unitsToMilliSecond.months == 0) return { value: (retentionTime / unitsToMilliSecond.months), unit: 'months' }
  if (retentionTime % unitsToMilliSecond.days == 0) return { value: (retentionTime / unitsToMilliSecond.days), unit: 'days' }
  if (retentionTime % unitsToMilliSecond.seconds == 0) return { value: (retentionTime / unitsToMilliSecond.seconds), unit: 'seconds' }

  return { value: retentionTime, unit: 'milliseconds' }
}

export const determineMemoryUnit = (retentionSize: number): ConversionResponse => {
  if (retentionSize % unitsToBytes.tebibytes == 0) return { value: (retentionSize / unitsToBytes.tebibytes), unit: 'tebibytes' }
  if (retentionSize % unitsToBytes.gibibytes == 0) return { value: (retentionSize / unitsToBytes.gibibytes), unit: 'gibibytes' }
  if (retentionSize % unitsToBytes.mebibytes == 0) return { value: (retentionSize / unitsToBytes.mebibytes), unit: 'mebibytes' }
  if (retentionSize % unitsToBytes.kibibytes == 0) return { value: (retentionSize / unitsToBytes.kibibytes), unit: 'kibibytes' }

  return { value: retentionSize, unit: 'bytes' }
}

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
