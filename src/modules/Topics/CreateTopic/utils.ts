import { ConfigEntry, NewTopicInput } from '@app/openapi';
import { IAdvancedTopic } from './Components/CreateTopicWizard';

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
  kilobytes: 1000,
  megabytes: 1000000,
  gigabytes: 1000000000,
  terabytes: 1000000000000,
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

export const convertRetentionTime = (milliseconds: number): string => {
  let convertedValue;
  if (milliseconds === -1) {
    return 'Unlimited';
  } else if (milliseconds < 60000) {
    if (milliseconds === 1) return milliseconds + ' ' + 'millisecond';
    else return milliseconds + ' ' + 'milliseconds';
  } else if (milliseconds >= 60000 && milliseconds < 3.6e6) {
    convertedValue = milliseconds / 60000;
    convertedValue = Math.round(convertedValue * 100) / 100;
    if (convertedValue === 1) return convertedValue + ' ' + 'minute';
    else return convertedValue + ' ' + 'minutes';
  } else if (milliseconds >= 3.6e6 && milliseconds < 1.728e8) {
    convertedValue = milliseconds / 3.6e6;
    convertedValue = Math.round(convertedValue * 100) / 100;
    if (convertedValue === 1) return convertedValue + ' ' + 'hour';
    else return convertedValue + ' ' + 'hours';
  } else if (milliseconds >= 1.728e8) {
    convertedValue = milliseconds / 8.64e7;
    convertedValue = Math.round(convertedValue * 100) / 100;
    return convertedValue + ' ' + 'days';
  }
  return milliseconds.toString();
};

export const convertRetentionSize = (byte: number): string => {
  let convertedByteValue;
  if (byte === -1) {
    return 'Unlimited';
  } else if (Math.abs(byte) < 1000) {
    if (byte === 1) return byte + ' ' + 'byte';
    else return byte + ' ' + 'bytes';
  } else if (Math.abs(byte) >= 1000 && Math.abs(byte) < 1000000) {
    convertedByteValue = byte / 1000;
    if (convertedByteValue === 1)
      return convertedByteValue + ' ' + 'kilobyte';
    else return convertedByteValue + ' ' + 'kilobytes';
  } else if (Math.abs(byte) >= 1000000 && Math.abs(byte) < 1000000000) {
    convertedByteValue = byte / 1000000;
    if (convertedByteValue === 1)
      return convertedByteValue + ' ' + 'megabyte';
    else return convertedByteValue + ' ' + 'megabytes';
  } else if (Math.abs(byte) >= 1000000000 && Math.abs(byte) < 1000000000000) {
    convertedByteValue = byte / 1000000000;
    if (convertedByteValue === 1)
      return convertedByteValue + ' ' + 'gigabyte';
    else return convertedByteValue + ' ' + 'gigabytes';
  } else if (Math.abs(byte) >= 1000000000000) {
    convertedByteValue = byte / 1000000000000;
    if (convertedByteValue === 1)
      return convertedByteValue + ' ' + 'terabyte';
    else return convertedByteValue + ' ' + 'terabytes';
  }
  return byte.toString();
};