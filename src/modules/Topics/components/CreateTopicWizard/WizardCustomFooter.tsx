import React from 'react';
import {
  WizardContextConsumer,
  Button,
  WizardFooter,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

export interface IWizardFooter {
  isLoading: boolean;
  onValidate: (value: () => void) => void;
  topicNameValidated: 'error' | 'default';
  closeWizard: () => void;
}
export const WizardCustomFooter: React.FC<IWizardFooter> = ({
  isLoading,
  onValidate,
  topicNameValidated,
  closeWizard,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  return (
    <WizardFooter>
      <WizardContextConsumer>
        {({ activeStep, onNext, onBack }) => {
          if (activeStep.name == t('topic.topic_name')) {
            return (
              <>
                <Button
                  variant='primary'
                  type='submit'
                  isLoading={isLoading}
                  onClick={() => onValidate(onNext)}
                  isDisabled={topicNameValidated == 'default' ? false : true}
                  ouiaId={'button-next'}
                >
                  {t('common.next')}
                </Button>
                <Button
                  ouiaId={'button-back'}
                  variant='secondary'
                  isDisabled={true}
                >
                  {t('common.back')}
                </Button>
                <Button
                  ouiaId={'button-cancel'}
                  variant='link'
                  onClick={closeWizard}
                >
                  {t('common.cancel')}
                </Button>
              </>
            );
          }

          if (activeStep.name == 'Replicas') {
            return (
              <>
                <Button
                  variant='primary'
                  type='submit'
                  onClick={onNext}
                  isLoading={isLoading}
                  ouiaId={'button-finish'}
                >
                  {t('common.finish')}
                </Button>
                <Button
                  ouiaId={'button-back'}
                  variant='secondary'
                  onClick={onBack}
                >
                  {t('common.back')}
                </Button>
                <Button
                  ouiaId={'button-cancel'}
                  variant='link'
                  onClick={closeWizard}
                >
                  {t('common.cancel')}
                </Button>
              </>
            );
          }
          return (
            <>
              <Button
                ouiaId={'button-next'}
                variant='primary'
                type='submit'
                onClick={onNext}
              >
                {t('common.next')}
              </Button>
              <Button
                ouiaId={'button-back'}
                variant='secondary'
                onClick={onBack}
              >
                {t('common.back')}
              </Button>
              <Button
                ouiaId={'button-cancel'}
                variant='link'
                onClick={closeWizard}
              >
                {t('common.cancel')}
              </Button>
            </>
          );
        }}
      </WizardContextConsumer>
    </WizardFooter>
  );
};
