const {
  serverCertificates,
  mockAdminCertificates,
  devEnvValues,
} = require('../tooling/runtimeDevUtils.js');
const { devServer, mockadminServer } = devEnvValues;

module.exports = {
  client: {
    transport: {
      ...serverCertificates,
    },
  },
  logging: {
    level: 'debug',
    prettyPrint: {
      translateTime: true,
    },
  },
  modules: {
    api: true,
    client: false,
    config: true,
    log: true,
    health: true,
    mockapi: false,
  },
  proxy: {
    ...mockadminServer,
    transport: {
      ...mockAdminCertificates,
    },
  },
  ...devServer,
};
