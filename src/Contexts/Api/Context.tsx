import React from 'react';

export type IConfiguration = {
  basePath: string;
  getToken: () => Promise<string>;
};

export const ConfigContext = React.createContext<IConfiguration | undefined>(
  undefined
);
