/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { TopicList } from '../../Entities/Entities.generated';

/** the shape of the object returned by the useTopicsModel hook */
export type useTopicsModelType = {
  model: {
    filter: string | undefined;
    topics: TopicList;
    error: Error | undefined;
    isLoading: boolean;
  };
  updateTopicsFilter: (filter: string) => void;
};
