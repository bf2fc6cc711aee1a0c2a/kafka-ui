const OpenAPIBackend = require("openapi-backend").default;
const express = require("express");
const kafkaHandlers = require("./kafka-service-handlers");
const topicHandlers = require("./strimzi-api-handlers");
const path = require("path");
var cors = require("cors");

const api = express();
api.use(express.json());
api.use(cors());

// define api
const kasFleetManagerAPI = new OpenAPIBackend({
  definition: path.join(__dirname, "../kafka-service.yaml"),
});
const kafkaAdminAPI = new OpenAPIBackend({
  definition: path.join(__dirname, "../kafka-admin.yaml"),
});

// register handlers
kasFleetManagerAPI.register(kafkaHandlers);
kafkaAdminAPI.register(topicHandlers);

// register security handler
kasFleetManagerAPI.registerSecurityHandler("Bearer", (c, req, res) => {
  return true;

  // const authHeader = c.request.headers['authorization'];
  // if (!authHeader) {
  //   throw new Error('Missing authorization header');
  // }
  // const token = authHeader.replace('Bearer ', '');
  // return jwt.verify(token, 'secret');
});

// register security handler
kafkaAdminAPI.registerSecurityHandler("Bearer", (c, req, res) => {
  return true;

  // const authHeader = c.request.headers['authorization'];
  // if (!authHeader) {
  //   throw new Error('Missing authorization header');
  // }
  // const token = authHeader.replace('Bearer ', '');
  // return jwt.verify(token, 'secret');
});

// Skipping validation of the schema
// validation fails on this schema definition
// even though it is valid through other validation forms like Swagger.io
kafkaAdminAPI.validateDefinition = () => {};

kasFleetManagerAPI.init();
kafkaAdminAPI.init();

api.use((req, res) => {
  if (req.url.startsWith("/api/managed-services-api/v1")) {
    return kasFleetManagerAPI.handleRequest(req, req, res);
  } else if (req.url.startsWith("/api/managed-services-strimzi-ui/v1/api")) {
    req.url = req.url.replace("/api/managed-services-strimzi-ui/v1/api", "");
    return kafkaAdminAPI.handleRequest(req, req, res);
  }
  res.status(405).status({ err: "Method not allowed" });
});

api.listen(8000, () =>
  console.info("Kafka Service API listening at http://localhost:8000")
);
