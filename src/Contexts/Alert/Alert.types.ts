import { AlertVariant } from '@patternfly/react-core';

export type AlertContextProps = {
  addAlert: (message: string, variant: AlertVariant) => void;
};

export type AlertType = {
  key: number;
  message: string;
  variant: AlertVariant;
};

export type TimeOut = {
  key: number;
  timeOut: NodeJS.Timeout;
};
