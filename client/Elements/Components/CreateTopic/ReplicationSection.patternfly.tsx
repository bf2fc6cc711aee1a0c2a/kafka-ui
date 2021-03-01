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
import React from 'react';
import { FormGroupWithPopover } from '../Common/FormGroupWithPopover/FormGroupWithPopover.patternfly';
import { TopicContext } from 'Contexts/Topic';
import { kebabToDotSeparated } from './utils';
import { useTranslation } from 'react-i18next';

export const ReplicationSection: React.FC = () => {
  const { store, updateStore } = React.useContext(TopicContext);

  const { t } = useTranslation();

  const handleTextInputChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const { name: fieldName } = event.currentTarget;
    updateStore(kebabToDotSeparated(fieldName), value);
  };

  const handleCheckboxSelect = (checked: boolean, event) => {
    const { name: fieldName } = event.currentTarget;
    updateStore(kebabToDotSeparated(fieldName), checked);
  };

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h2} tabIndex={-1} id='replication'>
          Replication
        </Text>
        <Text component={TextVariants.p}>
          {t('createTopic.replicationSectionInfo')}
        </Text>
      </TextContent>
      <Form>
        <FormGroupWithPopover
          fieldId='unclean-leader-election'
          fieldLabel='Unclean leader election'
          labelHead={t('createTopic.leaderElectionLabelHead')}
          labelBody={t('createTopic.leaderElectionLabelBody')}
          buttonAriaLabel='More info for leader election field'
        >
          <Checkbox
            isChecked={Boolean(store['unclean.leader.election.enable'])}
            label='Allow unclean leader election'
            aria-label='uncontrolled checkbox example'
            id='leader-election'
            onChange={handleCheckboxSelect}
            name='unclean-leader-election-enable'
          />
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='follower-replicas'
          fieldLabel='Follower replication throttled replicas'
          labelHead={t('createTopic.followerReplicaLabelHead')}
          labelBody={t('createTopic.followerReplicaLabelBody')}
          buttonAriaLabel='More info for follower throttled replicas field'
        >
          <InputGroup>
            <TextInput
              name='follower-replication-throttled-replicas'
              type='text'
              aria-label='Text'
              onChange={handleTextInputChange}
              value={store['follower.replication.throttled.replicas']}
            />
          </InputGroup>
        </FormGroupWithPopover>
        <FormGroupWithPopover
          fieldId='leader-replicas'
          fieldLabel='Leader replication throttled replicas'
          labelHead={t('createTopic.leaderReplicaLabelHead')}
          labelBody={t('createTopic.leaderReplicaLabelBody')}
          buttonAriaLabel='More info for leader throttled replicas field'
        >
          <InputGroup>
            <TextInput
              name='leader-replication-throttled-replicas'
              type='text'
              aria-label='Text'
              onChange={handleTextInputChange}
              value={store['leader.replication.throttled.replicas']}
            />
          </InputGroup>
        </FormGroupWithPopover>
      </Form>
    </>
  );
};
