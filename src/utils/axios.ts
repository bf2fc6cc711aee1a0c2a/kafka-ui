import { AxiosError } from 'axios';

export const isAxiosError = (error: Error): error is AxiosError => {
  return (error as AxiosError) !== undefined;
};
