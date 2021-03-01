const {
  serverCertificates,
  mockAdminCertificates,
  devEnvValues,
} = require('../tooling/runtimeDevUtils.js');
const { devServer, mockadminServer } = devEnvValues;

// used in e2e, this is the UI server running as it would in a prod environment, but using mock admin/certificate config
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
  proxy: {
    ...mockadminServer,
    transport: {
      ...mockAdminCertificates,
    },
  },
  ...devServer,
};
