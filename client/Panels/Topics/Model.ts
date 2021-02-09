/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";
import { TopicList } from "../../Entities/Entities.generated";
import { DefaultApi } from "../../OpenApi/api";

const onChangeEvent = (value: string, callWithValue: (value: string) => void) =>
  callWithValue(value);

export const useTopicsModel = () => {
  const [filter, setTopicsFilter] = useState();
  const debouncedUpdateTopicsFilter = useCallback(
    (value) => debounce(setTopicsFilter(value), 500),
    []
  );

  const model = {
    topics: [],
  } as TopicList;
  const topicListObj = new DefaultApi();
  topicListObj.getTopicsList().then((data) => {
    console.log("topic data", data);
    const model = {
      filter,
      topicList:
        data?.data ||
        ({
          topics: [],
        } as TopicList),
    };
  });
  // const { data, loading, error } = useQuery<Query>(GET_TOPICS, {
  //   variables: { filter },
  // });

  return {
    model,
    updateTopicsFilter: (evt) =>
      onChangeEvent(evt, debouncedUpdateTopicsFilter),
  };
};
