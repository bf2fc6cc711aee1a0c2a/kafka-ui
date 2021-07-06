export interface FederatedProps {
  onError: (errorCode: number, message: string) => void;
}

export enum KafkaActions {
  ViewTopics = 'ViewTopics',
  CreateTopic = 'CreateTopic',
  DetailsTopic = 'DetailsTopic',
  UpdateTopic = 'UpdateTopic',
}

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
    if (convertedByteValue === 1) return convertedByteValue + ' ' + 'kilobyte';
    else return convertedByteValue + ' ' + 'kilobytes';
  } else if (Math.abs(byte) >= 1000000 && Math.abs(byte) < 1000000000) {
    convertedByteValue = byte / 1000000;
    if (convertedByteValue === 1) return convertedByteValue + ' ' + 'megabyte';
    else return convertedByteValue + ' ' + 'megabytes';
  } else if (Math.abs(byte) >= 1000000000 && Math.abs(byte) < 1000000000000) {
    convertedByteValue = byte / 1000000000;
    if (convertedByteValue === 1) return convertedByteValue + ' ' + 'gigabyte';
    else return convertedByteValue + ' ' + 'gigabytes';
  } else if (Math.abs(byte) >= 1000000000000) {
    convertedByteValue = byte / 1000000000000;
    if (convertedByteValue === 1) return convertedByteValue + ' ' + 'terabyte';
    else return convertedByteValue + ' ' + 'terabytes';
  }
  return byte.toString();
};
