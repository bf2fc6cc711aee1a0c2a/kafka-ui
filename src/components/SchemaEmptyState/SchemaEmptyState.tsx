import React from 'react';
import {
  Title,
  Button,
  EmptyState as PFEmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  TitleSizes,
  EmptyStateVariant,
  ClipboardCopy,
  EmptyStateSecondaryActions,
  Card,
  CardBody,
  CardTitle,
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
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

  const { variant, icon, titleSize } = {
    variant: EmptyStateVariant.large,
    icon: InfoCircleIcon,
    titleSize: TitleSizes.lg,
  };
  const history = useHistory();

  const onClickLink = () => {
    history.push(`${linkRoute}`);
  };

  return (
    <>
      <Card>
        {schemaHeader && <CardTitle>{schemaHeader}</CardTitle>}
        <CardBody>
          <PFEmptyState variant={variant} {...restEmptyStateProps}>
            <EmptyStateIcon icon={icon} color='#2B9AF3' />
            {
              <Title headingLevel='h2' size={titleSize} {...restTitleProps}>
                {title}
              </Title>
            }
            {<EmptyStateBody>{bodyContent}</EmptyStateBody>}
            {
              <ClipboardCopy
                isReadOnly
                hoverTip='Copy'
                clickTip='Copied'
                maxWidth='500px'
              >
                {topicKey}
              </ClipboardCopy>
            }
            {
              <ClipboardCopy isReadOnly hoverTip='Copy' clickTip='Copied'>
                {topicValue}
              </ClipboardCopy>
            }
            {
              <EmptyStateSecondaryActions>
                <Button variant='link' onClick={onClickLink}>
                  Go to Service Registry instance
                </Button>
              </EmptyStateSecondaryActions>
            }
          </PFEmptyState>
        </CardBody>
      </Card>
    </>
  );
};
