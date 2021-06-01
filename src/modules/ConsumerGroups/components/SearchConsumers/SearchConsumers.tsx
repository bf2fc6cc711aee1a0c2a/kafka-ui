import React from "react";
import { InputGroup, SearchInput } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";

export type SearchConsumerGroupProps = {
  setSearch: (value: string) => void;
  search: string;
};

const SearchConsumers: React.FunctionComponent<SearchConsumerGroupProps> = ({
  search,
  setSearch,
}) => {
  const { t } = useTranslation();

  const onChangeInput = (value: string) => {
    setSearch(value);
  };
  const onClear = () => {
    setSearch("");
  };
  return (
    <InputGroup>
      <SearchInput
        name="searchName"
        id="search-consumers-input"
        type="search"
        aria-label={t("consumerGroup.search")}
        placeholder={t("common.search")}
        value={search}
        onChange={onChangeInput}
        onClear={onClear}
      />
    </InputGroup>
  );
};
export { SearchConsumers };
