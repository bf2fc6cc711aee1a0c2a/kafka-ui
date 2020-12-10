/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { useState } from 'react';
import { InputGroup, SearchInput } from '@patternfly/react-core';
import { useTopicsModel } from '../../../Panels/Topics/Model';

const SearchTopics: React.FunctionComponent = () => {
  const [search, setSearch] = useState('');

  const { updateTopicsFilter } = useTopicsModel();
  const onChangeInput = (value: string) => {
    setSearch(value);
    updateTopicsFilter(search);
  };
  const onClear = () => {
    setSearch('');
    updateTopicsFilter(search);
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
