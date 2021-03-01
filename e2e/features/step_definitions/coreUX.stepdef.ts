import { And, Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the strimzi-ui homepage', () => {
  cy.visit('localhost:3000/index.html');
});

Then(`the welcome message appears`, () => {
  cy.get('#root').contains(`Welcome to the Strimzi UI`);
});

And(`version information about this UI is displayed`, () => {
  // validates the context/server config modules work - exact step to change in future
  cy.get('#root').contains(`Version: 0.0.1`);
});
