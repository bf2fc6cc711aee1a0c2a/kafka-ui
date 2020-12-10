/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

// placeholder GQL schema for a topic/topic list - ideally to come from file

import { readFileSync } from 'fs';

export const loadSchema = (): string => {
  return readFileSync('./server/mockapi/schema.graphql', 'utf8');
};
