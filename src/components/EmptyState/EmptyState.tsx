import React from 'react';
import {
  Button,
  ButtonProps,
  ButtonVariant,
  EmptyState as PFEmptyState,
  EmptyStateBody,
  EmptyStateBodyProps,
  EmptyStateIcon,
  EmptyStateIconProps,
  EmptyStateProps as PFEmptyStateProps,
  EmptyStateVariant,
  Title,
  TitleProps,
  TitleSizes,
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
    headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };
  emptyStateProps?: Omit<PFEmptyStateProps, 'children' | 'variant'> & {
    variant?: MASEmptyStateVariant | EmptyStateVariant;
    'data-ouia-page-id'?: string;
  };
  emptyStateIconProps?: EmptyStateIconProps;
  emptyStateBodyProps?: Omit<EmptyStateBodyProps, 'children'> & {
    body?: string | React.ReactNode;
  };
  buttonProps?: Omit<ButtonProps, 'children'> & {
    title?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    'data-testid'?: string;
    ouiaId?: string;
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

  type VariantConfig = Pick<PFEmptyStateProps, 'variant'> &
    Pick<EmptyStateIconProps, 'icon'> &
    Pick<TitleProps, 'size'> &
    Pick<TitleProps, 'headingLevel'>;

  const getVariantConfig = (): VariantConfig => {
    let variantConfig = {} as VariantConfig;

    switch (masEmptyStateVariant) {
      case MASEmptyStateVariant.NoConsumerGroups:
        variantConfig = {
          variant: EmptyStateVariant.large,
          icon: CubesIcon,
          size: TitleSizes.lg,
          headingLevel: 'h2',
        };
        break;
      case MASEmptyStateVariant.NoItems:
        variantConfig = {
          variant: EmptyStateVariant.large,
          icon: PlusCircleIcon,
          size: TitleSizes.lg,
          headingLevel: 'h2',
        };
        break;
      case MASEmptyStateVariant.NoResult:
        variantConfig = {
          variant: EmptyStateVariant.large,
          icon: SearchIcon,
          size: TitleSizes.lg,
          headingLevel: 'h2',
        };
        break;

      default:
        variantConfig = {
          variant: masEmptyStateVariant || EmptyStateVariant.full,
          icon: emptyStateIconProps?.icon,
          size: titleProps?.size,
          headingLevel: titleProps?.headingLevel || 'h1',
        };
        break;
    }

    return variantConfig;
  };

  const { variant, icon, size, headingLevel } = getVariantConfig();

  return (
    <>
      <PFEmptyState variant={variant} {...restEmptyStateProps}>
        <EmptyStateIcon icon={icon} {...emptyStateIconProps} />
        {title && (
          <Title headingLevel={headingLevel} size={size} {...restTitleProps}>
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
