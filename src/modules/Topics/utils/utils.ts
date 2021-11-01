import { ConfigEntry, NewTopicInput, Topic } from '@rhoas/kafka-instance-sdk';
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

type ConversionUnit = {
  value: number;
  unit: string;
};

export const millisecondsToTime = (value: number): ConversionUnit => {
  if (value) {
    if (value % unitsToMilliSecond.years == 0)
      return { value: value / unitsToMilliSecond.years, unit: 'years' };
    if (value % unitsToMilliSecond.months == 0)
      return { value: value / unitsToMilliSecond.months, unit: 'months' };
    if (value % unitsToMilliSecond.days == 0)
      return { value: value / unitsToMilliSecond.days, unit: 'days' };
    if (value % unitsToMilliSecond.seconds == 0)
      return { value: value / unitsToMilliSecond.seconds, unit: 'seconds' };

    // const seconds = value / unitsToMilliSecond.seconds;
    // const days = value / unitsToMilliSecond.days;
    // const months = value / unitsToMilliSecond.months;
    // const years = value / unitsToMilliSecond.years;

    // if (seconds >= 1 && days < 1) {
    //   return { value: seconds, unit: 'seconds' }
    // } else if (days >= 1 && months < 1) {
    //   return { value: days, unit: 'days' }
    // } else if (months >= 1 && years < 1) {
    //   return { value: months, unit: 'months' }
    // } else if (years >= 1) {
    //   return { value: years, unit: 'years' };
    // }
  }
  return { value, unit: 'milliseconds' };
};

export const formattedRetentionTime = (time: number): string => {
  const { unit, value } = millisecondsToTime(time);
  return Number(value) === -1 ? 'Unlimited' : `${time} ms (${value} ${unit})`;
};

export const formattedRetentionSize = (size: number): string => {
  const { unit, value } = bytesToMemorySize(size);
  return Number(value) === -1
    ? 'Unlimited'
    : `${size} bytes (${value} ${unit})`;
};

export const bytesToMemorySize = (value: number): ConversionUnit => {
  if (value) {
    if (value % unitsToBytes.tebibytes == 0)
      return { value: value / unitsToBytes.tebibytes, unit: 'tebibytes' };
    if (value % unitsToBytes.gibibytes == 0)
      return { value: value / unitsToBytes.gibibytes, unit: 'gibibytes' };
    if (value % unitsToBytes.mebibytes == 0)
      return { value: value / unitsToBytes.mebibytes, unit: 'mebibytes' };
    if (value % unitsToBytes.kibibytes == 0)
      return { value: value / unitsToBytes.kibibytes, unit: 'kibibytes' };

    // const kibibytes = value / unitsToBytes.kibibytes;
    // const mebibytes = value / unitsToBytes.mebibytes;
    // const gibibytes = value / unitsToBytes.gibibytes;
    // const tebibytes = value / unitsToBytes.tebibytes;

    // if (kibibytes >= 1 && mebibytes < 1) {
    //   return { value: kibibytes, unit: 'kibibytes' };
    // } else if (mebibytes >= 1 && gibibytes < 1) {
    //   return { value: mebibytes, unit: 'mebibytes' };
    // } else if (gibibytes >= 1 && tebibytes < 1) {
    //   return { value: gibibytes, unit: 'gibibytes' };
    // } else if (tebibytes >= 1) {
    //   return { value: tebibytes, unit: 'tebibytes' };
    // }
  }
  return { value, unit: 'bytes' };
};

export type KeyValue = {
  key: string;
  value: number;
};

export const deserializeTopic = (topic: Topic): ConfigEntry => {
  const newTopic = { ...topic };
  const configEntries: ConfigEntry = {};
  newTopic?.config?.forEach((e: ConfigEntry) => {
    const { key = '', value } = e;
    if (key === 'retention.ms' && Number(value) >= 0) {
      const { value: newValue, unit } = millisecondsToTime(Number(value));
      configEntries[key] = newValue;
      configEntries[`${key}.unit`] = unit;
    } else if (Number(value) === -1) {
      configEntries['isRetentionTimeUnlimited'] = true;
    }

    if (key === 'retention.bytes' && Number(value) >= 0) {
      const { value: newValue, unit } = bytesToMemorySize(Number(value));
      configEntries[key] = newValue;
      configEntries[`${key}.unit`] = unit;
    } else if (Number(value) === -1) {
      configEntries['isRetentionSizeUnlimited'] = true;
    }

    if (key === 'cleanup.policy') {
      configEntries[key] = value || 'delete';
    }
  });

  return configEntries;
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

  if (topic['isRetentionTimeUnlimited']) {
    topic['retention.ms'] = '-1';
  }

  if (topic['isRetentionSizeUnlimited']) {
    topic['retention.bytes'] = '-1';
  }

  if (topic['flush.messages']) {
    topic['flush.messages'] = String(
      Number(topic['flush.messages']) *
        unitsToMilliSecond[topic['flush.messages.unit'] || 'milliseconds']
    );
  }

  for (const key in topic) {
    if (
      key.split('.').pop() === 'unit' ||
      key === 'isRetentionTimeUnlimited' ||
      key === 'isRetentionSizeUnlimited'
    ) {
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
