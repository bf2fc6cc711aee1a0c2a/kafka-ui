import React from "react";
import {
  Button,
  ButtonVariant,
  InputGroup,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@patternfly/react-icons";

export type SearchTopicsProps = {
  setSearch: (value: string) => void;
  setSearchTopicName: (value: string) => void;
  search: string;
  setFilteredTopics: (value: boolean) => void;
};
const SearchTopics: React.FunctionComponent<SearchTopicsProps> = ({
  search,
  setSearch,
  setFilteredTopics,
  setSearchTopicName,
}) => {
  const { t } = useTranslation();

  const onChangeInput = (value: string) => {
    setSearch(value);
  };

  const onSearch = () => {
    setSearchTopicName(search);
    setFilteredTopics(true);
    setSearch("");
  };

  return (
    <InputGroup>
      <TextInput
        name="searchName"
        id="search-topics-input"
        type="search"
        aria-label={t("topic.topic_search_input")}
        placeholder={t("common.search")}
        value={search}
        onChange={onChangeInput}
      />
      <Button
        variant={ButtonVariant.control}
        isDisabled={search.length ? false : true}
        onClick={onSearch}
        aria-label={t("topic.topic_search")}
      >
        <SearchIcon />
      </Button>
    </InputGroup>
  );
};
export { SearchTopics };
