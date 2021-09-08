export type Validated<T> = {
  value: T;
  invalid?: boolean;
  errorMessage?: string;
};
