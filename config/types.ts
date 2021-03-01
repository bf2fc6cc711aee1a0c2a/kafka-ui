import { client, featureFlags, server } from './index';

export * from './config.types';

export type exposedClientType = typeof client.publicValues;
export type exposedFeatureFlagsType = typeof featureFlags.publicValues;
export type exposedServerType = typeof server.publicValues;
