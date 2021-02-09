/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
module.exports = {
  createServiceAccount: async (c, req, res) => {
    const clientId = Number.MAX_SAFE_INTEGER - new Date().getTime();
    const clientSecret = Number.MAX_SAFE_INTEGER - new Date().getTime();
    res.status(200).json({
      name: req.body.name,
      description: req.body.description,
      clientID: clientId.toString(),
      clientSecret: clientSecret.toString(),
    });
  },
  createKafka: async (c, req, res) => {
    res.status(202).json({
      id: "1iSY6RQ3JKI8Q0OTmjQFd3ocFRg",
      kind: "kafka",
      href: "/api/managed-services-api/v1/kafkas/1iSY6RQ3JKI8Q0OTmjQFd3ocFRg",
      status: "complete",
      cloud_provider: "aws",
      multi_az: false,
      region: "us-east-1",
      owner: "api_kafka_service",
      name: "serviceapi",
      bootstrapServerHost:
        "serviceapi-1isy6rq3jki8q0otmjqfd3ocfrg.apps.ms-bttg0jn170hp.x5u8.s1.devshift.org",
      created_at: "2020-10-05T12:51:24.053142Z",
      updated_at: "2020-10-05T12:56:36.362208Z",
    });
  },

  deleteKafkaById: async (c, req, res) => {
    res.status(204).json({
      id: "1iSY6RQ3JKI8Q0OTmjQFd3ocFRg",
      kind: "kafka",
      href: "/api/managed-services-api/v1/kafkas/1iSY6RQ3JKI8Q0OTmjQFd3ocFRg",
      status: "complete",
      cloud_provider: "aws",
      multi_az: false,
      region: "us-east-1",
      owner: "api_kafka_service",
      name: "serviceapi",
      bootstrapServerHost:
        "serviceapi-1isy6rq3jki8q0otmjqfd3ocfrg.apps.ms-bttg0jn170hp.x5u8.s1.devshift.org",
      created_at: "2020-10-05T12:51:24.053142Z",
      updated_at: "2020-10-05T12:56:36.362208Z",
    });
  },

  getKafkaById: async (c, req, res) => {
    res.status(200).json({
      id: "1iSY6RQ3JKI8Q0OTmjQFd3ocFRg",
      kind: "kafka",
      href: "/api/managed-services-api/v1/kafkas/1iSY6RQ3JKI8Q0OTmjQFd3ocFRg",
      status: "complete",
      cloud_provider: "aws",
      multi_az: false,
      region: "us-east-1",
      owner: "api_kafka_service",
      name: "serviceapi",
      bootstrapServerHost:
        "serviceapi-1isy6rq3jki8q0otmjqfd3ocfrg.apps.ms-bttg0jn170hp.x5u8.s1.devshift.org",
      created_at: "2020-10-05T12:51:24.053142Z",
      updated_at: "2020-10-05T12:56:36.362208Z",
    });
  },

  listKafkas: async (c, req, res) => {
    const { status, mock } = c.api.mockResponseForOperation(c.operation.operationId);
    return res.status(status).json(mock);
  },

  // Handling auth
  notFound: async (c, req, res) => res.status(404).json({ err: "not found" }),
  unauthorizedHandler: async (c, req, res) =>
    res.status(401).json({ err: "unauthorized" }),
};
