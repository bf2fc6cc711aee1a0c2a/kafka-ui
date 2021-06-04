import React from 'react';
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  AlertVariant,
} from '@patternfly/react-core';
import { AlertType } from '@app/contexts/Alert';

type AlertToastGroupProps = {
  alerts: AlertType[];
  onCloseAlert: (key: number) => void;
};

export const ServerAlertGroup: React.FC<AlertToastGroupProps> = ({
  alerts,
  onCloseAlert,
}) => {
  return (
    <AlertGroup isToast>
      {alerts.map(({ key, variant, message }) => (
        <Alert
          key={key}
          isLiveRegion
          variant={AlertVariant[variant]}
          variantLabel=''
          title={message}
          actionClose={
            <AlertActionCloseButton
              title={message}
              onClose={() => onCloseAlert(key)}
            />
          }
        />
      ))}
    </AlertGroup>
  );
};
