import { AxiosError } from 'axios';

export type ErrorData = {
  code: number;
  error_message: string;
};

export const isAxiosError = (
  error: unknown
): error is AxiosError<ErrorData> => {
  return (error as AxiosError<ErrorData>) !== undefined;
};
