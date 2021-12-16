import { useTranslation } from 'react-i18next';

export const useValidateTopic = (): {
  validateName(name: string): string | undefined;
} => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  return {
    validateName: (name) => {
      const legalNameChars = new RegExp('^[a-zA-Z0-9._-]+$');
      if (name.length && !legalNameChars.test(name)) {
        return t('topic.topic_name_helper_text');
      } else if (name.length > 249) {
        return t('topic.cannot_exceed_characters');
      } else if (name === '.' || name === '..') {
        return t('topic.invalid_name_with_dot');
      }
      return undefined;
    },
  };
};
