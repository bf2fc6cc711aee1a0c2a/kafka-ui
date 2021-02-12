/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
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
