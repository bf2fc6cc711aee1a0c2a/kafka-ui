/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import { createProxyServer } from 'http-proxy';
import { After, And, Before, Fusion, Then } from 'jest-cucumber-fusion';
import {
  stepWhichUpdatesWorld,
  stepWithWorld,
} from 'test_common/commonServerSteps';
import { expressMiddleware } from 'types';

// without setting up a second server (with secure and insecure modes), the best way to simulate the proxying of calls is mocking them/verifying the api usage
type mockProxyServerType = {
  on: (event: string, handler: expressMiddleware) => void;
  web: jest.Mock<expressMiddleware>;
};

const placeholderProxyEvent = jest.fn();
const successResponseBody = 'OK from mock';
const mockServerImplementation: (
  shouldError: boolean
) => mockProxyServerType = (shouldError) => {
  const mockProxyEvents = {
    proxyReq: placeholderProxyEvent,
    proxyRes: placeholderProxyEvent,
    error: placeholderProxyEvent,
  };
  return {
    on: jest
      .fn()
      .mockImplementation(
        (event, handler) => (mockProxyEvents[event] = handler)
      ),
    web: jest.fn().mockImplementation((req, res) => {
      mockProxyEvents.proxyReq({}, req, res);
      if (shouldError) {
        mockProxyEvents.error({ message: 'mock error' }, req, res);
      } else {
        mockProxyEvents.proxyRes(
          { statusCode: 200, statusMessage: successResponseBody },
          req,
          res
        );
        res.status(200).send(successResponseBody);
      }
    }),
  };
}; // unpack the web to trigger on etc
const createMockServerFn: (shouldError?: boolean) => mockProxyServerType = (
  shouldError = false
) => mockServerImplementation(shouldError);

jest.mock('http-proxy', () => ({
  createProxyServer: jest.fn(),
}));

Before(() => {
  createProxyServer.mockReturnValue(createMockServerFn(false));
});

After(() => {
  // reset all mocks to starting state
  jest.clearAllMocks();
});

And(
  'the backend proxy returns an error response',
  stepWhichUpdatesWorld((world) => {
    const { context } = world;
    createProxyServer.mockReturnValue(createMockServerFn(true));
    return {
      ...world,
      context: {
        ...context,
        responseWillError: true,
      },
    };
  })
);

Then(
  'I make the expected proxy request and get the expected proxied response',
  stepWithWorld(async (world) => {
    const { request, context } = world;
    const expectFailure = context.responseWillError ? true : false;

    await request.expect((res) => {
      // confirm the API module handles the response
      if (expectFailure) {
        expect(res.status).toBe(500);
      } else {
        expect(res.status).toBe(200);
        expect(res.text).toEqual(successResponseBody);
      }
    });

    // check all mock calls for expected values
    expect(createProxyServer).toHaveBeenCalledTimes(1);

    expect(placeholderProxyEvent).not.toBeCalled(); // confirm placeholder event handlers are not called (ie ones provided by API module are)
  })
);

Fusion('api.feature');
