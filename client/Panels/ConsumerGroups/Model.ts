/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { useCallback, useState } from 'react';
import { GET_CONSUMERS } from 'Queries/ConsumerGroups';
import { useQuery } from '@apollo/client';
import { useConsumersModelType } from './useConsumersModel.types';
import debounce from 'lodash.debounce';
import { Query, ConsumersList } from '../../Entities/Entities.generated';

const onChangeEvent = (value: string, callWithValue: (value: string) => void) =>
  callWithValue(value);

export const useConsumersModel = (): useConsumersModelType => {
  const [filter, setConsumersFilter] = useState();
  const debouncedUpdateConsumersFilter = useCallback(
    (value) => debounce(setConsumersFilter(value), 500),
    []
  );
  const { data, loading, error } = useQuery<Query>(GET_CONSUMERS, {
    variables: { filter },
  });

  const model = {
    filter,
    consumersList:
      data?.consumersList ||
      ({
        items: [],
      } as ConsumersList),
    error,
    loading,
  };

  return {
    model,
    updateConsumersFilter: (evt) =>
      onChangeEvent(evt, debouncedUpdateConsumersFilter),
  };
};
