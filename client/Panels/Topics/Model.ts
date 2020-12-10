/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { useCallback, useState } from 'react';
import { GET_TOPICS } from 'Queries/Topics';
import { useQuery } from '@apollo/client';
import { useTopicsModelType } from './useTopicsModel.types';
import debounce from 'lodash.debounce';
import { Query, TopicList } from '../../Entities/Entities.generated';

const onChangeEvent = (value: string, callWithValue: (value: string) => void) =>
  callWithValue(value);

export const useTopicsModel = (): useTopicsModelType => {
  const [filter, setTopicsFilter] = useState();
  const debouncedUpdateTopicsFilter = useCallback(
    (value) => debounce(setTopicsFilter(value), 500),
    []
  );
  const { data, loading, error } = useQuery<Query>(GET_TOPICS, {
    variables: { filter },
  });

  const model = {
    filter,
    topicList:
      data?.topicList ||
      ({
        items: [],
      } as TopicList),
    error,
    loading,
  };

  return {
    model,
    updateTopicsFilter: (evt) =>
      onChangeEvent(evt, debouncedUpdateTopicsFilter),
  };
};
