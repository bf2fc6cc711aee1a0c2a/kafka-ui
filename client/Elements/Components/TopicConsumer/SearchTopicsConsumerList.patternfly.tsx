/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { useState } from 'react';
import {
  InputGroup,
  SearchInput,
  Button,
  ButtonVariant,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import { TopicConsumerData } from './TopicConsumerData';

export interface ITopicConsumer {
  id: string;
  members: number;
  partitions: number;
  state: string;
}
export interface ISearchTopicsConsumerListProps {
  tableData: (value: ITopicConsumer[]) => void;
}
export const SearchTopicsConsumerList: React.FunctionComponent<ISearchTopicsConsumerListProps> = ({
  tableData,
}) => {
  const [search, setSearch] = useState('');

  const onChangeInput = (value: string) => {
    setSearch(value);
  };

  const onConfirm = () => {
    tableData(
      TopicConsumerData.filter(
        (row) => row.id.toLowerCase().indexOf(search.toLowerCase()) > -1
      )
    );
  };
  const onClear = () => {
    setSearch('');
    tableData(TopicConsumerData);
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
      <Button
        variant={ButtonVariant.control}
        aria-label='search button for search input'
        onClick={onConfirm}
      >
        <SearchIcon />
      </Button>
    </InputGroup>
  );
};
