import { ConfigEntry, NewTopicInput, Topic } from '@rhoas/kafka-instance-sdk';
import { IAdvancedTopic } from '@app/modules/Topics/utils';

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
  if (typeof val === 'string') {
    return val.replace(/-/g, '.');
  }
  return val;
};

export enum RetentionTimeUnits {
  MILLISECOND = 'milliseconds',
  SECOND = 'seconds',
  MINUTE = 'minutes',
  HOUR = 'hours',
  DAY = 'day',
  WEEK = 'weeks',
  CUSTOM = 'custom',
  UNLIMITED = 'unlimited',
}

export enum RetentionSizeUnits {
  BYTE = 'bytes',
  KIBIBYTE = 'kibibytes',
  MEBIBYTE = 'mebibytes',
  GIBIBYTE = 'gibibytes',
  TEBIBYTE = 'tebibytes',
  CUSTOM = 'custom',
  UNLIMITED = 'unlimited',
}

export const unitsToBytes = {
  bytes: 1,
  kibibytes: 1024,
  mebibytes: 1048576,
  gibibytes: 1073741824,
  tebibytes: 1.0995116e12,
};

export const unitsToMilliSecond = {
  milliseconds: 1,
  seconds: 1000,
  minutes: 60000,
  hours: 3600000,
  days: 86400000,
};

export const RetentionTimeUnitToValue = {
  ...unitsToMilliSecond,
  day: 1,
  weeks: 7,
};

type ConversionUnit = {
  value: number;
  unit: string;
};

export const millisecondsToTime = (value: number): ConversionUnit => {
  if (value) {
    if (value % unitsToMilliSecond.days == 0)
      return { value: value / unitsToMilliSecond.days, unit: 'days' };
    if (value % unitsToMilliSecond.hours == 0)
      return { value: value / unitsToMilliSecond.hours, unit: 'hours' };
    if (value % unitsToMilliSecond.minutes == 0)
      return { value: value / unitsToMilliSecond.minutes, unit: 'minutes' };
    if (value % unitsToMilliSecond.seconds == 0)
      return { value: value / unitsToMilliSecond.seconds, unit: 'seconds' };
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
  }

  return { value, unit: 'bytes' };
};

export type KeyValue = {
  key: string;
  value: number;
};

export const deserializeTopic = (topic: Topic): IAdvancedTopic => {
  const newTopic = { ...topic };
  const configEntries: Partial<IAdvancedTopic> = {};

  newTopic?.config?.forEach((e: ConfigEntry) => {
    const { key = '', value } = e;

    if (key === 'retention.ms' && Number(value) >= 0) {
      const { value: newValue, unit } = millisecondsToTime(Number(value));
      configEntries[key] = `${newValue}`;
      configEntries[`${key}.unit`] = unit;
      configEntries['selectedRetentionTimeOption'] = RetentionTimeUnits.CUSTOM;
    } else if (key === 'retention.ms' && Number(value) === -1) {
      configEntries['selectedRetentionTimeOption'] =
        RetentionTimeUnits.UNLIMITED;
    }

    if (key === 'retention.bytes' && Number(value) >= 0) {
      const { value: newValue, unit } = bytesToMemorySize(Number(value));
      configEntries[key] = `${newValue}`;
      configEntries[`${key}.unit`] = unit;
      configEntries['selectedRetentionSizeOption'] = RetentionSizeUnits.CUSTOM;
    } else if (key === 'retention.bytes' && Number(value) === -1) {
      configEntries['selectedRetentionSizeOption'] =
        RetentionSizeUnits.UNLIMITED;
    }

    if (key === 'cleanup.policy') {
      configEntries[key] = value || 'delete';
    }
  });

  return configEntries as IAdvancedTopic;
};

export const serializeTopic = (
  topicData: IAdvancedTopic,
  addionalProperties: string[] = []
): NewTopicInput => {
  const configProperties = [
    'retention.ms',
    'retention.bytes',
    'flush.messages',
    ...addionalProperties,
  ];
  const tempProperties = [
    'retention.ms.unit',
    'retention.bytes.unit',
    'selectedRetentionTimeOption',
    'selectedRetentionSizeOption',
  ];
  const topic: IAdvancedTopic = { ...topicData };
  const config: ConfigEntry[] = [];

  for (const _key in topic) {
    const key = _key as keyof IAdvancedTopic;
    let value;
    //check key exist in include config properties and add properties in config object
    if (configProperties.includes(key)) {
      //check unlimited retention time and size and set -1 value
      if (
        (topic.selectedRetentionTimeOption === RetentionTimeUnits.UNLIMITED &&
          key === 'retention.ms') ||
        (topic.selectedRetentionSizeOption === RetentionSizeUnits.UNLIMITED &&
          key === 'retention.bytes')
      ) {
        value = '-1';
      } else if (key === 'retention.ms' || key === 'retention.bytes') {
        const topicUnitMs = (topic[`${key}.unit`] ||
          'milliseconds') as keyof typeof unitsToMilliSecond;
        const topicUnitByte = (topic[`${key}.unit`] ||
          'bytes') as keyof typeof unitsToBytes;
        //calculate value based on entered value * selected unit
        const unit =
          key === 'retention.ms'
            ? unitsToMilliSecond[topicUnitMs]
            : unitsToBytes[topicUnitByte];
        value = Number(topic[key]) * unit;
      } else {
        value = topic[key];
      }
    }

    //delete properties which are not required
    if (key.split('.').pop() === 'unit' || tempProperties.includes(key)) {
      delete topic[key];
    }

    //prepare config object with key/value
    if (value && key) {
      config.push({
        key,
        value: value.toString(),
      });
    }
  }

  return {
    name: topic.name,
    settings: {
      numPartitions: Number(topic.numPartitions),
      config,
    },
  };
};
