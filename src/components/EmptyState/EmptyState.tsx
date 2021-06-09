import React from 'react';
import {
  Title,
  Button,
  EmptyState as PFEmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  TitleSizes,
  TitleProps,
  ButtonProps,
  EmptyStateIconProps,
  EmptyStateProps as PFEmptyStateProps,
  EmptyStateBodyProps,
  ButtonVariant,
  EmptyStateVariant,
} from '@patternfly/react-core';
import PlusCircleIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';

import CubesIcon from '@patternfly/react-icons/dist/js/icons/cubes-icon';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';

export enum MASEmptyStateVariant {
  NoConsumerGroups = 'NoConsumerGroups',
  NoResult = 'NoResult',
  NoItems = 'NoItems',
}

export type EmptyStateProps = {
  titleProps?: Omit<TitleProps, 'children' | 'headingLevel'> & {
    headingLevel?: string;
  };
  emptyStateProps?: Omit<PFEmptyStateProps, 'children' | 'variant'> & {
    variant?: MASEmptyStateVariant | EmptyStateVariant;
  };
  emptyStateIconProps?: EmptyStateIconProps;
  emptyStateBodyProps?: Omit<EmptyStateBodyProps, 'children'> & {
    body?: string | React.ReactNode;
  };
  buttonProps?: Omit<ButtonProps, 'children'> & {
    title?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    'data-testid'?: string;
  };
  children?: React.ReactNode;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  titleProps,
  buttonProps,
  emptyStateIconProps,
  emptyStateProps,
  emptyStateBodyProps,
  children,
}: EmptyStateProps) => {
  const {
    variant: buttonVariant = ButtonVariant.primary,
    onClick,
    ...restButtonProps
  } = buttonProps || {};
  const { title, ...restTitleProps } = titleProps || {};
  const { body, ...restEmptyStateBodyProps } = emptyStateBodyProps || {};
  const {
    variant: masEmptyStateVariant = MASEmptyStateVariant.NoItems,
    ...restEmptyStateProps
  } = emptyStateProps || {};

  const getVariantConfig = () => {
    let variantConfig: any = {};

    switch (masEmptyStateVariant) {
      case MASEmptyStateVariant.NoConsumerGroups:
        variantConfig = {
          variant: EmptyStateVariant.large,
          icon: CubesIcon,
          titleSize: TitleSizes.lg,
          headingLevel: 'h2',
        };
        break;
      case MASEmptyStateVariant.NoItems:
        variantConfig = {
          variant: EmptyStateVariant.large,
          icon: PlusCircleIcon,
          titleSize: TitleSizes.lg,
          headingLevel: 'h2',
        };
        break;
      case MASEmptyStateVariant.NoResult:
        variantConfig = {
          variant: EmptyStateVariant.large,
          icon: SearchIcon,
          titleSize: TitleSizes.lg,
          headingLevel: 'h2',
        };
        break;

      default:
        variantConfig = {
          variant: masEmptyStateVariant || EmptyStateVariant.full,
          icon: emptyStateIconProps?.icon,
          titleSize: titleProps?.size,
          headingLevel: titleProps?.headingLevel,
        };
        break;
    }

    return variantConfig;
  };

  const { variant, icon, titleSize, headingLevel } = getVariantConfig();

  return (
    <>
      <PFEmptyState variant={variant} {...restEmptyStateProps}>
        <EmptyStateIcon icon={icon} {...emptyStateIconProps} />
        {title && (
          <Title
            headingLevel={headingLevel}
            size={titleSize}
            {...restTitleProps}
          >
            {title}
          </Title>
        )}
        {body && (
          <EmptyStateBody {...restEmptyStateBodyProps}>{body}</EmptyStateBody>
        )}
        {buttonProps?.title && (
          <Button
            variant={buttonVariant}
            onClick={onClick}
            {...restButtonProps}
          >
            {buttonProps?.title}
          </Button>
        )}
        {children}
      </PFEmptyState>
    </>
  );
};
