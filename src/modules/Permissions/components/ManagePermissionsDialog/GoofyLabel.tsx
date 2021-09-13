import React from 'react';
import { AclResourceType } from '@rhoas/kafka-instance-sdk';

export type GoofyLabelProps = {
  variant: AclResourceType;
};

export const GoofyLabel: React.FunctionComponent<GoofyLabelProps> = ({
  variant,
}) => {
  const variantSwitch = (): { colorClass: string; content: string } => {
    switch (variant) {
      case AclResourceType.Group:
        return { colorClass: 'pf-m-green', content: 'G' };
        break;
      case AclResourceType.Cluster:
        return { colorClass: '', content: 'KI' };
        break;
      case AclResourceType.Topic:
        return { colorClass: 'pf-m-blue', content: 'T' };
        break;
      case AclResourceType.TransactionalId:
        return { colorClass: 'pf-m-orange', content: 'TI' };
        break;
    }
  };
  const { colorClass, content } = variantSwitch();
  return (
    <span className={`pf-c-label ${colorClass} mas-m-solid`}>
      <span className='pf-c-label__content'>{content}</span>
    </span>
  );
};
