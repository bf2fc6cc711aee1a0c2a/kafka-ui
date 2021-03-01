import { Config, Literal } from './config.types';
import { getEnvvarValue } from './configHelpers';

/**
 * runtime configuration - values which can only be defined/evaluated at server runtime
 */

const client: Config<Literal> = {};

const server: Config<Literal> = {
  serverConfigPath: {
    configValue: getEnvvarValue('configPath', './server.config.json'),
  },
  serverName: {
    configValue: getEnvvarValue('serverName', 'Strimzi-ui server'),
  },
};

export { client, server };
