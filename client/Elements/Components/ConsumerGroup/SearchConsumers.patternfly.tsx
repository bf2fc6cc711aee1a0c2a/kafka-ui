/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { useState } from 'react';
import { InputGroup, SearchInput } from '@patternfly/react-core';
import { useConsumersModel } from '../../../Panels/ConsumerGroups/Model';

const SearchConsumers: React.FunctionComponent = () => {
  const [search, setSearch] = useState('');

  const { updateConsumersFilter } = useConsumersModel();
  const onChangeInput = (value: string) => {
    setSearch(value);
    updateConsumersFilter(search);
  };
  const onClear = () => {
    setSearch('');
    updateConsumersFilter(search);
  };
  return (
    <InputGroup>
      <SearchInput
        name='searchName'
        id='searchConsumersInput'
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
