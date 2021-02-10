/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { DefaultApi } from "../../OpenApi/api";

export const useTopicsModel = async () => {
  const topicListObj = new DefaultApi();
  const model=await topicListObj
    .getTopicsList();
  return {
    model,
  };
};
