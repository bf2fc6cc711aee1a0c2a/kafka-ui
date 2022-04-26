import React from 'react';
import { useTranslation } from 'react-i18next';
import { SidebarPanel, JumpLinks, JumpLinksItem } from '@patternfly/react-core';

const TopicAdvanceJumpLinks: React.FC = () => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);

  return (
    <SidebarPanel variant='sticky'>
      <JumpLinks
        isVertical
        label={t('topic.jump_to_section')}
        scrollableSelector='.pf-c-page__main-section.pf-m-overflow-scroll'
        style={{ position: 'sticky' }}
        // offset={-164} // for header
      >
        <JumpLinksItem key={0} href='#core-configuration'>
          {t('topic.core_configuration')}
        </JumpLinksItem>
        <JumpLinksItem key={1} href='#messages'>
          {t('topic.messages')}
        </JumpLinksItem>
        <JumpLinksItem key={2} href='#log'>
          {t('topic.log')}
        </JumpLinksItem>
        <JumpLinksItem key={3} href='#replication'>
          {t('topic.replication')}
        </JumpLinksItem>
        <JumpLinksItem key={4} href='#cleanup'>
          {t('common.cleanup')}
        </JumpLinksItem>
        <JumpLinksItem key={5} href='#index'>
          {t('topic.index')}
        </JumpLinksItem>
        <JumpLinksItem key={6} href='#flush'>
          {t('topic.flush')}
        </JumpLinksItem>
      </JumpLinks>
    </SidebarPanel>
  );
};

export { TopicAdvanceJumpLinks };
