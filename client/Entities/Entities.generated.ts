/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
/* eslint-disable */
import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  /**  search: can contain any form of Kafka topic name  */
  topicList?: Maybe<TopicList>;
  topic: Topic;
};

export type QueryTopicListArgs = {
  search?: Maybe<Scalars['String']>;
  page?: Maybe<PageRequest>;
  orderBy?: Maybe<OrderByInput>;
};

export type QueryTopicArgs = {
  name: Scalars['String'];
};

export type Mutation = {
  createTopic: Topic;
  deleteTopics?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type MutationCreateTopicArgs = {
  input: NewTopic;
};

export type MutationDeleteTopicsArgs = {
  names?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Topic = {
  /** ID */
  name?: Maybe<Scalars['String']>;
  partitions: Array<Partition>;
  config?: Maybe<Array<Maybe<ConfigEntry>>>;
};

/** embedded in Topic */
export type Partition = {
  /** ID */
  partition?: Maybe<Scalars['Int']>;
  replicas: Array<Node>;
  /** InSyncReplicas */
  isr?: Maybe<Array<Maybe<Node>>>;
  leader?: Maybe<Node>;
};

export type Node = {
  id: Scalars['Int'];
};

export type ConfigEntry = {
  key: Scalars['String'];
  value: Scalars['String'];
};

export type OrderByInput = {
  field: Scalars['String'];
  order?: Maybe<SortDirectionEnum>;
};

export type PageRequest = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export enum SortDirectionEnum {
  Desc = 'DESC',
  Asc = 'ASC',
}

export type TopicList = {
  topics: Array<Maybe<Topic>>;
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
};

export type TopicListResponse = { data: TopicList };

export type NewTopicConfigEntry = {
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type NewTopic = {
  name: Scalars['String'];
  numPartitions: Scalars['Int'];
  replicationFactor: Scalars['Int'];
  config?: Maybe<Array<Maybe<NewTopicConfigEntry>>>;
};
