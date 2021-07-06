const ignoredBinaries = ['png', 'svg', 'ico', 'scss'].join('|');
const testCommon = '<rootDir>/../test_common';
const mockFile = `${testCommon}/mockfile.util.ts`;

const jestModuleMapper = {
  [`^.+\\.(${ignoredBinaries})$`]: mockFile,
  '@app/(.*)': '<rootDir>/$1',
  '@test-utils/(.*)': '<rootDir>/../test-utils/$1',
};

module.exports = {
  jestModuleMapper,
};
