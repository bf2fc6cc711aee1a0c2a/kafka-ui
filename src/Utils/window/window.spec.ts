import { getLocation } from './window';

describe('window function tests', () => {
  describe(`getLocation`, () => {
    it('returns the location object from the window', () => {
      expect(getLocation()).toEqual(window.location);
    });
  });
});
