/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

// placeholder GQL schema for a topic/topic list - ideally to come from file

import { readFileSync } from 'fs';

const loadSchema = () => {
  return readFileSync('./server/mockapi/schema.graphql', 'utf8');
};

export const schema = `${loadSchema()}`;
