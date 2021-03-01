import React, { FunctionComponent } from 'react';

const Home: FunctionComponent = () => {
  return <div></div>;
  // const { client, featureFlags, isComplete } = useConfigFeatureFlag();
  // const version = get(client, 'about.version', '');
  // // use the feature flag from context - could also use the `FeatureFlag` component - this just shows alternative usage
  // const showVersion = get(featureFlags, 'client.Home.showVersion', false);

  // const { debug } = useLogger('Home');
  // debug(`Client version to display: ${version}`);

  // return (
  //   <div className='home'>
  //     <img src={image} alt='Strimzi logo' />
  //     <p>Welcome to the Strimzi UI</p>
  //     {showVersion && isComplete && <p>{`Version: ${version}`}</p>}
  //     {children}
  //   </div>
  // );
};

export { Home };

export default Home;
