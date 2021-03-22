import React, { useEffect } from 'react';
import {
  ActionGroup,
  Button,
  JumpLinks,
  JumpLinksItem,
  PageSection,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import './CreateTopicWizard.css';

import { MessageSection } from './MessageSection';
import { CoreConfiguration } from './CoreConfiguration';
import { LogSection } from './LogSection';
import { ReplicationSection } from './ReplicationSection';
import { IndexSection } from './IndexSection';
import { FlushSection } from './FlushSection';
import { CleanupSection } from './CleanupSection';
import { initialState, TopicContext } from '../../../../Contexts/Topic';

interface ITopicAdvanceConfig {
  isCreate: boolean;
  saveTopic: () => void;
}

export const TopicAdvanceConfig: React.FunctionComponent<ITopicAdvanceConfig> = ({
  isCreate,
  saveTopic,
}) => {
  const { updateBulkStore } = React.useContext(TopicContext);
  const actionText = isCreate === true ? 'Create Topic' : 'Save';

  useEffect(() => {
    updateBulkStore(initialState);
  }, []);

  const handleOnSave = () => {
    saveTopic();
    updateBulkStore(initialState);
  };

  return (
    <>
      <Sidebar hasGutter>
        <SidebarPanel variant='sticky'>
          <JumpLinks
            isVertical
            label='JUMP TO SECTION'
            scrollableSelector='#main-container'
            style={{ position: 'sticky' }}
            offset={-164} // for header
            expandable={{ default: 'expandable', md: 'nonExpandable' }}
            isExpanded={false}
          >
            <JumpLinksItem key={0} href='#core-configuration'>
              Core configuration
            </JumpLinksItem>
            <JumpLinksItem key={1} href='#messages'>
              Messages
            </JumpLinksItem>
            <JumpLinksItem key={2} href='#log'>
              Log
            </JumpLinksItem>
            <JumpLinksItem key={3} href='#replication'>
              Replication
            </JumpLinksItem>
            <JumpLinksItem key={4} href='#cleanup'>
              Cleanup
            </JumpLinksItem>
            <JumpLinksItem key={5} href='#index'>
              Index
            </JumpLinksItem>
            <JumpLinksItem key={6} href='#flush'>
              Flush
            </JumpLinksItem>
            {isCreate ? (
              <></>
            ) : (
              <JumpLinksItem key={7} href='#delete'>
                Delete
              </JumpLinksItem>
            )}
          </JumpLinks>
        </SidebarPanel>
        <SidebarContent>
          <PageSection
            className='kafka-ui--topics-advanced-config'
            padding={{ default: 'noPadding' }}
            hasOverflowScroll
            id='topic-advance-config-scroll-container'
          >
            <Stack hasGutter className='kafka-ui--topic-advanced-config__stack'>
              <StackItem>
                <CoreConfiguration />
              </StackItem>

              <StackItem>
                <MessageSection />
              </StackItem>

              <StackItem>
                <LogSection />
              </StackItem>

              <StackItem>
                <ReplicationSection />
              </StackItem>

              <StackItem>
                <CleanupSection />
              </StackItem>

              <StackItem>
                <IndexSection />
              </StackItem>

              <StackItem>
                <FlushSection />
              </StackItem>
            </Stack>
          </PageSection>

          <ActionGroup className='kafka-ui--sticky-footer'>
            <Button onClick={handleOnSave} variant='primary'>
              {actionText}
            </Button>
            <Button variant='link'>Cancel</Button>
          </ActionGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
};
