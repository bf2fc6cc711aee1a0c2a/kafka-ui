/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { useState, useEffect } from "react";
import { InputGroup, SearchInput } from "@patternfly/react-core";
import { consumerGroupData } from "./ConsumerGroupData";

export interface IConsumerGroupData {
  id: string;
  members: number;
  partitions: number;
  state: number;
}

export interface ISearchConsumerGroupProps {
  setTableData: (IConsumerGroupData) => void;
}

const SearchConsumers: React.FunctionComponent<ISearchConsumerGroupProps> = ({
  setTableData,
}) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search && search.trim() != "") {
      const filterSearch = consumerGroupData.filter((consumersFiltered) =>
        consumersFiltered?.id.includes(search)
      );
      setTableData(filterSearch);
      console.log(filterSearch);
    } else {
      setTableData(consumerGroupData);
    }
  }, [search]);

  const onChangeInput = (value: string) => {
    setSearch(value);
    setTableData(
      consumerGroupData.filter(
        (row) => row.id.toLowerCase().indexOf(search.toLowerCase()) > -1
      )
    );
  };
  const onClear = () => {
    setSearch("");
    setTableData(consumerGroupData);
  };
  return (
    <InputGroup>
      <SearchInput
        name="searchName"
        id="search-consumers-input"
        type="search"
        aria-label="search input "
        placeholder="Search"
        value={search}
        onChange={onChangeInput}
        onClear={onClear}
      />
    </InputGroup>
  );
};
export { SearchConsumers };
