/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import gql from 'graphql-tag';

export const GET_CONSUMERS = gql`
  query ConsumersList($filter: String) {
    consumersList(search: $filter) {
      items {
        id
        members {
          members
          partitions {
            partitions
            state {
              state
            }
          }
        }
      }
    }
  }
`;
