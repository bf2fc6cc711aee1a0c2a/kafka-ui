/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import { And, When, Then, Fusion } from 'jest-cucumber-fusion';
import {
  stepWhichUpdatesWorld,
  stepWithWorld,
} from 'test_common/commonServerSteps';

And(
  /^a session identifier of '(\S+)'$/,
  stepWhichUpdatesWorld((world, identifier) => {
    const config = world.configuration;
    config.session.name = identifier as string;
    return {
      ...world,
      config,
    };
  })
);

When(
  'I make a request with no unique request header',
  stepWhichUpdatesWorld((world) => {
    const { server } = world;
    return {
      ...world,
      request: server.get('/api/test'),
    };
  })
);

When(
  'I make a request with a unique request header',
  stepWhichUpdatesWorld((world) => {
    const { server, context } = world;
    const ID = 'HelloWorld';
    return {
      ...world,
      request: server.get('/api/test').set('x-strimzi-ui-request', ID),
      context: {
        ...context,
        requestId: ID,
      },
    };
  })
);

Then(
  'a unique request header is returned in the response',
  stepWithWorld((world) => {
    const { request } = world;
    return request.expect('x-strimzi-ui-request', /^.{16}$/).expect(418);
  })
);

Then(
  'the unique request header sent is returned in the response',
  stepWithWorld((world) => {
    const { request, context } = world;
    return request
      .expect('x-strimzi-ui-request', context.requestId as string)
      .expect(418);
  })
);

Then(
  'the mockapi handler is called',
  stepWithWorld((world) => {
    const { request } = world;
    // check/confirm the test header is present - only applied by mockapi's test handler, meaning the api module did not fire
    return request.expect('x-strimzi-ui-module', 'mockapi');
  })
);

Then(
  /^the response sets a cookie named '(\S+)'$/,
  stepWithWorld((world, cookieName) => {
    const { request } = world;
    return request.expect('set-cookie', new RegExp(`${cookieName}=\\S+`));
  })
);

Fusion('core.feature');
