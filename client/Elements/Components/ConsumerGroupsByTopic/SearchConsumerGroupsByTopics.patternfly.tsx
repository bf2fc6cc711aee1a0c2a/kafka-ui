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
import { ConsumerGroupDataByTopics } from './ConsumerDataByTopics';

export interface IConsumerGroupByTopic {
  id: string;
  members: number;
  partitions: number;
  state: string;
}
export interface ISearchConsumerGroupsByTopicsProps {
  setTableData: (value: IConsumerGroupByTopic[]) => void;
}
export const SearchConsumerGroupsByTopics: React.FunctionComponent<ISearchConsumerGroupsByTopicsProps> = ({
  setTableData,
}) => {
  const [searchText, setSearchText] = useState('');

  const onChangeInput = (value: string) => {
    setSearchText(value);
  };

  const onConfirm = () => {
    setTableData(
      ConsumerGroupDataByTopics.filter(
        (row) => row.id.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      )
    );
  };
  const onClear = () => {
    setSearchText('');
    setTableData(ConsumerGroupDataByTopics);
  };
  return (
    <InputGroup>
      <SearchInput
        name='searchName'
        id='searchText-consumer-groups-by-topic-input'
        type='searchText'
        aria-label='searchText input'
        placeholder='Search'
        value={searchText}
        onChange={onChangeInput}
        onClear={onClear}
      />
      <Button
        variant={ButtonVariant.control}
        aria-label='searchText button for searchText input'
        onClick={onConfirm}
        id='searchText-consumer-groups-by-topic-button'
      >
        <SearchIcon />
      </Button>
    </InputGroup>
  );
};
