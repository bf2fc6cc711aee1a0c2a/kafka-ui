import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonVariant,
  InputGroup,
  TextInput,
  ToolbarFilter,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { MASToolbar, ToolbarItemProps, MASPagination } from '@app/components';

export type TopicsToolbarProps = {
  total: number;
  page: number;
  perPage: number;
  setFilteredValue: (value: string) => void;
  filteredValue: string;
  onCreateTopic?: () => void;
};

const TopicsToolbar: React.FC<TopicsToolbarProps> = ({
  total = 0,
  page,
  perPage,
  setFilteredValue,
  filteredValue = '',
  onCreateTopic,
}) => {
  const { t } = useTranslation();
  const [topicInputValue, setTopicInputValue] = useState<string>('');

  const onClear = () => {
    setFilteredValue('');
  };

  const onChangeInput = (value: string) => {
    setTopicInputValue(value);
  };

  const onSearch = () => {
    setFilteredValue(topicInputValue);
    setTopicInputValue('');
  };

  const onDeleteChip = () => {
    setFilteredValue('');
  };

  const toggleGroupItems = (
    <>
      <ToolbarFilter
        chips={filteredValue ? [filteredValue] : []}
        deleteChip={onDeleteChip}
        categoryName={''}
      >
        <InputGroup>
          <TextInput
            name='searchName'
            id='search-topics-input'
            type='search'
            aria-label={t('topic.topic_search_input')}
            placeholder={t('common.search')}
            value={topicInputValue}
            onChange={onChangeInput}
          />
          <Button
            variant={ButtonVariant.control}
            isDisabled={topicInputValue.length ? false : true}
            onClick={onSearch}
            aria-label={t('topic.topic_search')}
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      </ToolbarFilter>
    </>
  );

  const toolbarItems: ToolbarItemProps[] = [
    {
      item: (
        <Button
          id="topic-list-create-topic-button"
          className="topics-per-page"
          data-ouia-page-id="topics-table"
          data-testid="tabTopics-actionCreate"
          onClick={onCreateTopic}
        >
          {t('topic.create_topic')}
        </Button>
      ),
    },
  ];

  if (total > 0) {
    toolbarItems.push({
      item: (
        <MASPagination
          widgetId='consumer-group-pagination-options-menu-top'
          itemCount={total}
          page={page}
          perPage={perPage}
          titles={{
            paginationTitle: t('common.minimal_pagination'),
            perPageSuffix: t('common.per_page_suffix'),
            toFirstPage: t('common.to_first_page'),
            toPreviousPage: t('common.to_previous_page'),
            toLastPage: t('common.to_last_page'),
            toNextPage: t('common.to_next_page'),
            optionsToggle: t('common.options_toggle'),
            currPage: t('common.curr_page'),
          }}
        />
      ),
      variant: 'pagination',
      alignment: { default: 'alignRight' },
    });
  }

  return (
    <MASToolbar
      toolbarProps={{
        id: 'instance-toolbar',
        clearAllFilters: onClear,
        collapseListedFiltersBreakpoint: 'md',
        inset: { xl: 'insetLg' },
      }}
      toggleGroupProps={{ toggleIcon: '', breakpoint: 'md' }}
      toggleGroupItems={toggleGroupItems}
      toolbarItems={toolbarItems}
    />
  );
};

export { TopicsToolbar };
