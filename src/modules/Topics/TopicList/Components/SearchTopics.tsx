import React from 'react';
import { InputGroup, SearchInput } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

export interface ISearchTopicsProps {
  setSearch: (value: string) => void;
  search: string;
  onClear: () => void;
}
const SearchTopics: React.FunctionComponent<ISearchTopicsProps> = ({
  search,
  setSearch,
  onClear,
}) => {
  const { t } = useTranslation();

  const onChangeInput = (value: string) => {
    setSearch(value);
  };

  const onClearHandler = () => {
    onClear();
    setSearch('');
  };
  return (
    <InputGroup>
      <SearchInput
        name='searchName'
        id='search-topics-input'
        type='search'
        aria-label={t('topic.topic_search_input')}
        placeholder={t('common.search')}
        value={search}
        onChange={onChangeInput}
        onClear={onClearHandler}
      />
    </InputGroup>
  );
};
export { SearchTopics };
