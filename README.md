[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)
[![Twitter Follow](https://img.shields.io/twitter/follow/strimziio.svg?style=social&label=Follow&style=for-the-badge)](https://twitter.com/strimziio)

# Kafka UI

Kafka UI provides a way for managing Kafka topics, and clusters using a graphical user interface.

## Getting started

This UI uses `npm` to provide dependency management. If you wish to develop the UI, you will need:

- [npm version 6.14.8 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [node 14.15.0 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Once these prerequisites are met, all required dependencies to build and run the UI can be downloaded by running the following command:

```
npm install
```

If you run into any issues while working in this repo, please check out [the troubleshooting guide](#troubleshooting).

### Helpful commands

`npm` scripts are provided for common tasks. These include:

- `npm run test` - runs all tests for the client and server
- `npm run start` - runs the UI client and server in development mode
- `npm run build` - builds the UI
- `npm run clean` - deletes the build/generated content directories
- `npm run lint` - lints the codebase. See [`Linting`](./docs/Linting.md) for the individual linting steps

## Contribution documentation
[Coding Standards](./docs/Coding.md)

## Troubleshooting

Currently there are no known issues.
