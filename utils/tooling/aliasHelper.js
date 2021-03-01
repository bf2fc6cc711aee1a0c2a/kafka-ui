const ignoredBinaries = ['png', 'svg', 'ico', 'scss'].join('|');
const testCommon = '<rootDir>/../test_common';
const mockFile = `${testCommon}/mockfile.util.ts`;

const jestModuleMapper = {
  [`^.+\\.(${ignoredBinaries})$`]: mockFile,
};

module.exports = {
  jestModuleMapper,
};
