import React from 'react';
import { InputGroup, SearchInput } from '@patternfly/react-core';

export interface IConsumerGroupData {
  id: string;
  members: number;
  partitions: number;
  state: number;
}

export interface ISearchConsumerGroupProps {
  setSearch: (value: string) => void;
  search: string;
}

const SearchConsumers: React.FunctionComponent<ISearchConsumerGroupProps> = ({
  search,
  setSearch,
}) => {
  const onChangeInput = (value: string) => {
    setSearch(value);
  };
  const onClear = () => {
    setSearch('');
  };
  return (
    <InputGroup>
      <SearchInput
        name='searchName'
        id='search-consumers-input'
        type='search'
        aria-label='search input '
        placeholder='Search'
        value={search}
        onChange={onChangeInput}
        onClear={onClear}
      />
    </InputGroup>
  );
};
export { SearchConsumers };
