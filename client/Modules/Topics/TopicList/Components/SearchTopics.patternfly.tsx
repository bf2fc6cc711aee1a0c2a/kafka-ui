import React from 'react';
import { InputGroup, SearchInput } from '@patternfly/react-core';

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
        aria-label='search input '
        placeholder='Search'
        value={search}
        onChange={onChangeInput}
        onClear={onClearHandler}
      />
    </InputGroup>
  );
};
export { SearchTopics };
