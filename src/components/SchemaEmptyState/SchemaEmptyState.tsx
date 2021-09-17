import React from 'react';
import {
  Title,
  Button,
  EmptyState as PFEmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateVariant,
  ClipboardCopy,
  EmptyStateSecondaryActions,
  Card,
  CardBody,
  CardTitle,
} from '@patternfly/react-core';
import { ArrowRightIcon, InfoCircleIcon } from '@patternfly/react-icons';
import { useHistory } from 'react-router-dom';

export enum MASEmptyStateVariant {
  NoConsumerGroups = 'NoConsumerGroups',
  NoResult = 'NoResult',
  NoItems = 'NoItems',
}

export type EmptyStateProps = {
  title?: string;
  bodyContent?: string;
  topicKey?: string;
  topicValue?: string;
  // bgColor?: string;
  linkRoute?: string;
  schemaHeader?: string;
};

export const SchemaEmptyState: React.FC<EmptyStateProps> = ({
  title,
  bodyContent,
  topicKey,
  topicValue,
  // bgColor,
  linkRoute,
  schemaHeader,
}: EmptyStateProps) => {
  const { ...restTitleProps } = {};
  const { ...restEmptyStateProps } = {};

  const history = useHistory();

  const onClickLink = () => {
    history.push(`${linkRoute}`);
  };

  return (
    <>
      <Card>
        {schemaHeader && <CardTitle>{schemaHeader}</CardTitle>}
        <CardBody>
          <PFEmptyState variant={EmptyStateVariant.xl} {...restEmptyStateProps}>
            <EmptyStateIcon icon={InfoCircleIcon} color='#2B9AF3' />
            <Title headingLevel='h2' {...restTitleProps}>
              {title}
            </Title>
            <EmptyStateBody>{bodyContent}</EmptyStateBody>
            <EmptyStateSecondaryActions>
              <ClipboardCopy
                isReadOnly
                hoverTip='Copy'
                clickTip='Copied'
                className='pf-u-w-25'
              >
                {topicKey}
              </ClipboardCopy>
            </EmptyStateSecondaryActions>
            <EmptyStateSecondaryActions>
              <ClipboardCopy
                isReadOnly
                hoverTip='Copy'
                clickTip='Copied'
                className='pf-u-w-25'
              >
                {topicValue}
              </ClipboardCopy>
            </EmptyStateSecondaryActions>
            <EmptyStateSecondaryActions>
              <Button variant='link' onClick={onClickLink}>
                Go to Service Registry instance <ArrowRightIcon />
              </Button>
            </EmptyStateSecondaryActions>
          </PFEmptyState>
        </CardBody>
      </Card>
    </>
  );
};
