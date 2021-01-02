/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import {
  TextContent,
  Text,
  Checkbox,
  Form,
  InputGroup,
  TextInput,
  TextVariants,
} from '@patternfly/react-core';
import '@patternfly/react-core/dist/styles/base.css';
import React from 'react';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';
import { TopicContext } from './TopicContext';
import { kebabToCamel } from './utils';

const leaderElectionLabelHead = 'Unclean leader election';
const leaderElectionLabelBody =
  'Allows a replica which is not in-sync to become the leader of the partition. This is only done as a last resort and can lead to data loss. (unclean.leader.election.enable)';

const followerReplicaLabelHead = 'Follower replication throttled replicas';
const followerReplicaLabelBody =
  'A list of the replicas for which replication should be throttled on the follower side. Can be used to limit the network bandwidth consumed by replication. (follower.replication.throttled.replicas)';

const leaderReplicaLabelHead = 'Leader replication throttled replicas';
const leaderReplicaLabelBody =
  'A list of the replicas for which replication should be throttled on the leader side. Can be used to limit the network bandwidth consumed by replication. (leader.replication.throttled.replicas)';

export const ReplicationSection: React.FC = () => {

  const { store, updateStore } = React.useContext(TopicContext); 

  const handleTextInputChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName } = event.currentTarget;
    updateStore(kebabToCamel(fieldName), value);
  };

  const handleCheckboxSelect = (checked: boolean, event) => {
    const { name: fieldName } = event.currentTarget;
    updateStore(kebabToCamel(fieldName), checked);
  };

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2} tabIndex={-1} id='replication'>
          Replication
        </Text>
        <Text component={TextVariants.p}>
          These details control the behavior of your replicas. Each of these
          parameters has an impact on every replica created in this topic.
        </Text>
      </TextContent>
      <Form>
        <FormGroupWithPopover
          fieldId='unclean-leader-election'
          fieldLabel='Unclean leader election'
          labelHead={leaderElectionLabelHead}
          labelBody={leaderElectionLabelBody}
          buttonAriaLabel='More info for leader election field'
        >
          <Checkbox
            isChecked={store.uncleanLeaderElection}
            label='Allow unclean leader election'
            aria-label='uncontrolled checkbox example'
            id='leader-election'
            onChange={handleCheckboxSelect}
            name='unclean-leader-election'
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='follower-replicas'
          fieldLabel='Follower replication throttled replicas'
          labelHead={followerReplicaLabelHead}
          labelBody={followerReplicaLabelBody}
          buttonAriaLabel='More info for follower throttled replicas field'
        >
          <InputGroup>
            <TextInput
              name='follower-replicas'
              type='text'
              aria-label='Text'
              onChange={handleTextInputChange}
              value={store.followerReplicas}
            />
          </InputGroup>
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='leader-replicas'
          fieldLabel='Leader replication throttled replicas'
          labelHead={leaderReplicaLabelHead}
          labelBody={leaderReplicaLabelBody}
          buttonAriaLabel='More info for leader throttled replicas field'
        >
          <InputGroup>
            <TextInput
              name='leader-replicas'
              type='text'
              aria-label='Text'
              onChange={handleTextInputChange}
              value={store.leaderReplicas}
            />
          </InputGroup>
        </FormGroupWithPopover>
      </Form>
    </>
  );
};
