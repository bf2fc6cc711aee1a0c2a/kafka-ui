/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import {Topic} from './topic.types';

export var topics: Array<Topic> = [
      {
        name: 'ExampleTopic',
        config: [
          {
            key: 'min.insync.replicas',
            value: "1"
          },
          {
            key: 'max.message.bytes',
            value: "1050000"
          }
        ],
        partitions: [
          {
            id: 28,
            replicas: [
              {
                id: 35
              },
              {
                id: 5
              }
            ],
            isr: [
              {
                id: 44
              },
              {
                id: 83
              }
            ],
            leader: {
              id: 22
            }
          }
        ]
      }]