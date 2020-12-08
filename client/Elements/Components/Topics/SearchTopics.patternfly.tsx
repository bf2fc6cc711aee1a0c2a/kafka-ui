/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { useState } from 'react';
import { InputGroup, SearchInput } from '@patternfly/react-core';
import { TopicsData } from './TopicsData';
export interface ITopic {
  name: string;
  replicas: number;
  partitions: number;
}
export interface ISearchTopics {
  viewFilteredTable: (value: boolean) => void;
  tableData: (value: ITopic[]) => void;
}
const SearchTopics: React.FunctionComponent<ISearchTopics> = ({
  viewFilteredTable,
  tableData,
}) => {
  const [search, setSearch] = useState('');
  const onChangeInput = (value: string) => {
    setSearch(value);
    viewFilteredTable(true);
    tableData(
      TopicsData.filter(
        (row) => row.name.toLowerCase().indexOf(search.toLowerCase()) > -1
      )
    );
  };
  const onClear = () => {
    setSearch('');
    tableData(TopicsData);
  };
  return (
    <InputGroup>
      <SearchInput
        name='searchName'
        id='searchTopicsInput'
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
export { SearchTopics };
