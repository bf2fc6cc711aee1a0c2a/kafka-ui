import React, { FunctionComponent } from 'react';
import image from 'Images/logo.png';
import './style.scss';
import '@patternfly/react-core/dist/styles/base.css';

const Home: FunctionComponent = ({ children }) => {
  return (
    <div className='home'>
      <img src={image} alt='Strimzi logo' />
      Welcome to the Strimzi UI for PatternFly
      {children}
    </div>
  );
};

export { Home };

export default Home;
