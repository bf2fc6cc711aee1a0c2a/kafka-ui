import { Config } from './config.types';

/**
 * feature flag configuration - used to enable/disable capabilities across the UI/server. The values can be static or dynamic, but the value must always be boolean
 */

export const featureFlags: Config<boolean> = {
  client: {
    Home: {
      showVersion: true,
    },
    Pages: {
      PlaceholderHome: true,
    },
  },
};
