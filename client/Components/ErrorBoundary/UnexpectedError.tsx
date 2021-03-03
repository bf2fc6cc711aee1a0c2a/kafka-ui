import React from 'react';
import { useHistory } from 'react-router';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { Button, ButtonVariant, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, PageSection, Title, TitleSizes } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

type IUnexpectedErrorProps = {
  updateState: (hasError: boolean) => void;
};

export const UnexpectedError: React.FC<IUnexpectedErrorProps> = ({
  updateState
}) => {

  const { t } = useTranslation();
  const history = useHistory();

  const navigateToHome = () => {
    updateState(false);
    history.push("/");
  }

  return (
    <PageSection padding={{ default: 'noPadding' }}>
      <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateIcon icon={ExclamationCircleIcon} />
        <Title headingLevel='h1' size={TitleSizes.lg}>
          {t('common.errorBoundaryTitle')}
        </Title>
        <EmptyStateBody>{t('common.unexpectedError')}</EmptyStateBody>
        <Button variant={ButtonVariant.primary} onClick={navigateToHome}>
          {t('common.returnToHome')}
        </Button>
      </EmptyState>
    </PageSection>
  )
}