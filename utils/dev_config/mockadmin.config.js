const {
  mockAdminCertificates,
  devEnvValues,
} = require('../tooling/runtimeDevUtils.js');
const { mockadminServer } = devEnvValues;

module.exports = {
  authentication: {
    strategy: 'none',
  },
  client: {
    transport: {
      ...mockAdminCertificates,
    },
  },
  logging: {
    level: 'debug',
    prettyPrint: {
      translateTime: true,
    },
  },
  modules: {
    api: false,
    client: false,
    config: true,
    health: true,
    mockapi: true,
  },
  proxy: {
    transport: {},
  },
  ...mockadminServer,
};
