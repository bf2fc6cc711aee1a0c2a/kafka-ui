import React, { FunctionComponent } from 'react';

const generateSimplePage = (text: string): FunctionComponent => {
  const page = () => {
    return <div>{text}</div>;
  };

  return page;
};

export { generateSimplePage };
