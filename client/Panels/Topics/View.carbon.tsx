/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
// import { useTopicsModel } from "./Model";

/**
 * Placeholder Topics panel FC.
 */
const Topics: FunctionComponent = ({ children }) => {
  // const { model } = useTopicsModel();

  // let topics: JSX.Element;
  // if (isLoading) {
  //   topics = <p>Loading...</p>;
  // } else {
  // topics = <p>{`Topics retrieved: ${JSON.stringify(model.topics)}`}</p>;
  // }

  return (
    <div className='topics'>
      <input
        placeholder='filter'
        // onChange={(evt) => updateTopicsFilter(evt.target.value)}
      />
      {/* {topics} */}
      {children}
    </div>
  );
};

export { Topics };
