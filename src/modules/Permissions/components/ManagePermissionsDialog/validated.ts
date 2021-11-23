import { ValidatedOptions } from '@patternfly/react-core';

export type Validated<T> = {
  value: T;
  validated?: ValidatedOptions;
  errorMessage?: string;
};
