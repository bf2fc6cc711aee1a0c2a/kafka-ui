/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { createContext } from 'react';

export interface IApiContext {
  basePath: string | undefined;
  getToken?: () => Promise<string>
}

export const ApiContext = React.createContext<IApiContext>({
  basePath: undefined,
  getToken: async () => {return ''}
});