/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";
import {
  Query,
  TopicList,
  TopicListResponse,
} from "../../Entities/Entities.generated";
import { DefaultApi } from "../../OpenApi/api";
import { useAsync } from "react-async";

const onChangeEvent = (value: string, callWithValue: (value: string) => void) =>
  callWithValue(value);

export const useTopicsModel = () => {
  const [filter, setTopicsFilter] = useState();
  const debouncedUpdateTopicsFilter = useCallback(
    (value) => debounce(setTopicsFilter(value), 500),
    []
  );

  const topicListObj = new DefaultApi();

  const { isLoading, error, data } = useAsync<any>(
    topicListObj.getTopicsList()
  );
  const model = data || { topics: [] };
  // let model = { };

  // await topicListObj.getTopicsList().then((data) => {
  //   console.log("data", data);
  //   model=data.data
  // });

  console.log("data", data, "model", model);
  return {
    model,
    isLoading,
    error
  };
};
