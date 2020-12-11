/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import express, { NextFunction, Request, Response } from 'express';
import { createProxyServer } from 'http-proxy';
import { UIServerModule } from 'types';
import fetch from 'node-fetch';
import cors from 'cors';

import {
  proxyCompleteHandler,
  proxyErrorHandler,
  proxyStartHandler,
} from './controller';

const moduleName = 'api';

export const ApiModule: UIServerModule = {
  moduleName,
  addModule: (logger, middlewares, serverConfig) => {
    const { proxy } = serverConfig;
    const { exit } = logger.entry('addModule', proxy);
    const { hostname, port, contextRoot, transport } = proxy;
    const { cert, minTLS } = transport;

    const routerForModule = express.Router();
    const backendProxy = createProxyServer();

    const findBootstrapServerHostMiddleware = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const token = req.header('X-API-OpenShift-Com-Token');
      const id = req.header('X-Kafka-ID');
      req.headers['x-api-openshift-com-token'] = '';
      req.headers['X-Kafka-ID'] = '';
      if (token === undefined || id === undefined) {
        return next();
      }
      const response = await fetch(
        `https://api.stage.openshift.com/api/managed-services-api/v1/kafkas/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        const host = data['bootstrapServerHost'];
        console.log(host);
        req['locals'].proxyTarget = `https://admin-server-${host}/graphql`;
        next();
      } else {
        throw new Error(`Unable to load ${id} from API because ${data}`);
      }
    };

    /*const useSpecifiedBootstrapHostMiddleware = async (
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            req["locals"].proxyTarget = "https://admin-server-my-cluster--lvxuydnqmjzftmtehrpobunwla.apps.ppatiern.sqe5.s1.devshift.org/graphql";
            return next();
        }*/

    const useLocalsMiddleware = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      req['locals'] = {};
      return next();
    };

    const proxyMiddleware = (req: Request, res: Response) => {
      const target = req['locals'].proxyTarget;
      const proxyConfig = {
        target:
          target ||
          `${cert ? 'https' : 'http'}://${hostname}:${port}${contextRoot}`,
        ca: cert,
        minVersion: minTLS,
        changeOrigin: true,
        secure: cert ? true : false,
      };
      console.log(proxyConfig);
      const cfg = { ...proxyConfig, target };
      backendProxy.web(req, res, cfg);
    };

    // add proxy event handlers
    backendProxy.on('error', proxyErrorHandler);
    backendProxy.on('proxyReq', proxyStartHandler);
    backendProxy.on('proxyRes', proxyCompleteHandler);
    // proxy all requests post auth check
    routerForModule.all(
      '*',
      middlewares,
      cors(),
      useLocalsMiddleware,
      findBootstrapServerHostMiddleware,
      proxyMiddleware
    );

    return exit({ mountPoint: '/api', routerForModule });
  },
};
