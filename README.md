[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

# Kafka UI

Kafka UI provides a way for managing Kafka topics, and clusters using a graphical user interface that uses 
[kafka-server](https://github.com/bf2fc6cc711aee1a0c2a/kafka-admin-api) as backend. 

Kafka Server is used as federated module in (app-services ui)[https://github.com/redhat-developer/app-services-ui] project
that aggretates various components. 

> NOTE: Kafka UI requires dedicated backend server that weren't tested with upstream Kafka. 

## Running locally with mocked data

This UI uses `npm` to provide dependency management. If you wish to develop the UI, you will need:

- [npm version 6.14.8 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [node 14.15.0 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Once these prerequisites are met, all required dependencies to build and run the UI can be downloaded by running the following command:

```bash
npm install
```

## Server side

Backend source code used by Kafka UI is located in separate repository

[bf2fc6cc711aee1a0c2a/kafka-admin-api](https://github.com/bf2fc6cc711aee1a0c2a/kafka-admin-api)


## Contribution documentation

[Coding Standards](./CONTRIBUTING.md)


