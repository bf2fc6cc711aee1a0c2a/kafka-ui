import { default as cucumber } from 'cypress-cucumber-preprocessor';

module.exports = (on: (evt: string, callback: () => void) => void) => {
  const options = {
    typescript: require.resolve('typescript'),
  };

  const cucumberPreProcessor = cucumber.default;

  on('file:preprocessor', cucumberPreProcessor(options));
};
