import { ICell } from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { AclPatternType, AclPermissionType } from '@rhoas/kafka-instance-sdk';
import { Label, Tooltip } from '@patternfly/react-core';
import { EnhancedAclBinding } from '@app/services/acls';
import React from 'react';
import { PrincipalType, usePrincipals } from '@bf2/ui-shared';

export type CellBuilder<T extends EnhancedAclBinding> = (
  item: T,
  row: number
) => ICell | string;

const AllAccountsPrincipal: React.FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        {t('permission.table.all_accounts')} <InfoCircleIcon color='grey' />
      </div>
      <div className='pf-u-font-size-xs'>
        {t('permission.table.all_accounts_help')}
      </div>
    </>
  );
};

type PrincipalWithTooltipProps = {
  acl: EnhancedAclBinding;
};
const PrincipalWithTooltip: React.FunctionComponent<PrincipalWithTooltipProps> =
  ({ acl }) => {
    const principals = usePrincipals().getAllPrincipals();

    const locatedPrincipals = principals.filter(
      (p) => p.id === acl.principalDisplay
    );

    if (locatedPrincipals.length === 1) {
      if (locatedPrincipals[0].principalType === PrincipalType.ServiceAccount) {
        return (
          <Tooltip
            content={
              <div>
                Type: {locatedPrincipals[0].principalType} <br />
              </div>
            }
          >
            <span tabIndex={0}>
              {' '}
              {acl.principalDisplay} <InfoCircleIcon color='grey' />
            </span>
          </Tooltip>
        );
      } else {
        return (
          <Tooltip
            content={
              <div>
                Type: {locatedPrincipals[0].principalType} <br />
                Name: {locatedPrincipals[0].displayName} <br />
                Email: {locatedPrincipals[0].emailAddress}
              </div>
            }
          >
            <span tabIndex={0}>
              {' '}
              {acl.principalDisplay} <InfoCircleIcon color='grey' />
            </span>
          </Tooltip>
        );
      }
    }
    return <span> {acl.principalDisplay}</span>;
  };

export const principalCell: CellBuilder<EnhancedAclBinding> = (item) => {
  switch (item.principal) {
    case 'User:*':
      return {
        title: <AllAccountsPrincipal />,
      };
      break;
    default:
      return {
        title: <PrincipalWithTooltip acl={item} />,
      };
      break;
  }
};

export const permissionCell: CellBuilder<EnhancedAclBinding> = (item) => {
  return item.permission === AclPermissionType.Deny
    ? ({
        title: (
          <Label color={'red'} variant={'outline'}>
            {item.permissionDisplay}
          </Label>
        ),
      } as ICell)
    : '';
};

export const operationCell: CellBuilder<EnhancedAclBinding> = (item) => {
  return {
    title: <Label color={item.operationColor}>{item.operationDisplay}</Label>,
  };
};

export const resourceCell: CellBuilder<EnhancedAclBinding> = (item) => {
  return {
    title: (
      <>
        <div>
          {item.resourceTypeDisplay}{' '}
          {item.patternType === AclPatternType.Prefixed
            ? 'name starts with'
            : 'is'}
        </div>
        <div className='pf-u-font-size-lg'>{item.resourceName}</div>
      </>
    ),
  };
};
