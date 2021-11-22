import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormSection,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { TextWithLabelPopover } from '@app/components';

const Replication: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FormSection
      title={t('topic.replication')}
      id='replication'
      titleElement={'h2'}
    >
      <TextContent>
        <Text component={TextVariants.p}>
          {t('topic.replication_section_info')}
          <Text component={TextVariants.small}>
            {t('topic.replication_section_info_note')}
          </Text>
        </Text>
      </TextContent>

      <TextWithLabelPopover
        fieldId='unclean-leader-election'
        btnAriaLabel={t('topic.unclean_leader_election')}
        fieldLabel={t('topic.unclean_leader_election')}
        fieldValue={t('common.disabled')}
        popoverBody={t('topic.unclean_leader_election_description')}
        popoverHeader={t('topic.unclean_leader_election')}
      />
    </FormSection>
  );
};

export { Replication };
