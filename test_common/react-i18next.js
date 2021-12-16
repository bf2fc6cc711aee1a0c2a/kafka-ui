const reacti18next = jest.genMockFromModule('react-i18next');

reacti18next.useTranslation = () => {
  return {
    t: (key) => key,
  };
};

module.exports = reacti18next;
