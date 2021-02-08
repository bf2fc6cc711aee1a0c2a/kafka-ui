/**
 *
 */
import { OpenAPIBackend } from 'openapi-backend';
import { UIServerModule } from 'types';
import express from 'express';
import handlers from './handlers';
import path from 'path';
import cors from 'cors';

const moduleName = 'mockopenapi';

export const MockOpenApiModule: UIServerModule = {
  moduleName,
  addModule: (logger) => {
    const { exit } = logger.entry('addModule');
    const routerForModule = express.Router();
    routerForModule.use(express.json());
    // define api
    const api = new OpenAPIBackend({
      definition: path.join(
        __dirname,
        '.../../../../config/strimziRestApi.yaml'
      ),
    });

    // register handlers
    api.register(handlers);
    routerForModule.use(cors());

    // register security handler
    api.registerSecurityHandler('Bearer', (c, req, res) => {
      return true;

      // const authHeader = c.request.headers['authorization'];
      // if (!authHeader) {
      //   throw new Error('Missing authorization header');
      // }
      // const token = authHeader.replace('Bearer ', '');
      // return jwt.verify(token, 'secret');
    });

    api.init();

    // use as express middleware
    routerForModule.use((req, res) => api.handleRequest(req as any, req, res));

    // start server
    // app.listen(port, () => console.info(`mock api listening at http://localhost:${port}`));
    return exit({ mountPoint: '/mockopenapi', routerForModule });
  },
};
