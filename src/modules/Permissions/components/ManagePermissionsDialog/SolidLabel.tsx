import React from 'react';
import { AclResourceType } from '@rhoas/kafka-instance-sdk';
import { Label, LabelProps } from '@patternfly/react-core';
import './SolidLabel.css';

export type SolidLabelProps = {
  variant: AclResourceType;
};

export const SolidLabel: React.FunctionComponent<SolidLabelProps> = ({
  variant,
}) => {
  const variantSwitch = (): {
    labelColor: LabelProps['color'];
    content: string;
  } => {
    switch (variant) {
      case AclResourceType.Group:
        return { labelColor: 'green', content: 'G' };
        break;
      case AclResourceType.Cluster:
        return { labelColor: 'grey', content: 'KI' };
        break;
      case AclResourceType.Topic:
        return { labelColor: 'blue', content: 'T' };
        break;
      case AclResourceType.TransactionalId:
        return { labelColor: 'orange', content: 'TI' };
        break;
    }
  };
  const { labelColor, content } = variantSwitch();
  return (
    <Label color={labelColor} className={`mas-m-solid`}>
      {content}
    </Label>
  );
};
