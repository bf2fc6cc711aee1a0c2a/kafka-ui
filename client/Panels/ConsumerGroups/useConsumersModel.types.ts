/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { ApolloError } from '@apollo/client';
import { ConsumersList } from '../../Entities/Entities.generated';

/** the shape of the object returned by the useConsumersGroupModel hook */
export type useConsumersModelType = {
  model: {
    filter: string | undefined;
    consumersList: ConsumersList;
    error: ApolloError | undefined;
    loading: boolean;
  };
  updateConsumersFilter: (filter: string) => void;
};
