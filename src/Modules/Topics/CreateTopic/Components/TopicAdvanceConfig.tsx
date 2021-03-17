import React, { useEffect } from 'react';
import {
  ActionGroup,
  Button,
  Divider,
  Grid,
  GridItem,
  JumpLinks,
  JumpLinksItem,
  PageSection,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
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
  deleteTopic?: () => void;
}

export const TopicAdvanceConfig: React.FunctionComponent<ITopicAdvanceConfig> = ({
  isCreate,
  saveTopic,
  deleteTopic,
}) => {
  const { updateBulkStore } = React.useContext(TopicContext);
  const actionText = isCreate === true ? 'Create Topic' : 'Save';

  useEffect(() => {
    updateBulkStore(initialState);
  }, [])

  const handleOnSave = () => {
    saveTopic();
    updateBulkStore(initialState);
  }

  return (
    <>
      <Grid hasGutter>
        <GridItem span={2}>
          <JumpLinks
            isVertical
            label='JUMP TO SECTION'
            scrollableSelector='#advanced-create-topic'
            style={{ position: 'sticky', top: 0 }}
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
        </GridItem>
        <GridItem span={10}>
          <PageSection
            hasOverflowScroll
            id='advanced-create-topic'
            className='kafka-ui--topics-advanced-config'
            padding={{ default: 'noPadding' }}
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

              <StackItem>
                <ActionGroup>
                  <Button onClick={handleOnSave} variant='primary'>
                    {actionText}
                  </Button>
                  <Button variant='link'>Cancel</Button>
                </ActionGroup>
              </StackItem>
            </Stack>

            {isCreate ? (
              <></>
            ) : (
              <>
                <br />
                <Divider />
                <br />
                <br />
                <TextContent className='section-margin'>
                  <Text component={TextVariants.h2} tabIndex={-1} id='delete'>
                    Delete topic (irreversible)
                  </Text>
                  <Text component={TextVariants.p}>
                    This permanently removes this topic from this instance of
                    Strimzi. Applications will no longer have access to this
                    topic.
                  </Text>
                </TextContent>
                <br />
                <Button
                  variant='danger'
                  className='section-margin'
                  onClick={deleteTopic}
                >
                  Delete topic
                </Button>
              </>
            )}
          </PageSection>
        </GridItem>
      </Grid>
    </>
  );
};
