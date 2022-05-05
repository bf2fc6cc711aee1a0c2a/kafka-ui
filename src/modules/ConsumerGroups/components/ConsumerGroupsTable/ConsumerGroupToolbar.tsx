import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonVariant,
  InputGroup,
  TextInput,
  ToolbarFilter,
} from '@patternfly/react-core';
import { MASToolbar, ToolbarItemProps, MASPagination } from '@app/components';
import { SearchIcon } from '@patternfly/react-icons';

export type ConsumerGroupToolbarProps = {
  setSearch: (value: string) => void;
  search: string;
  total: number;
  page: number;
  perPage: number;
};

const ConsumerGroupToolbar: React.FC<ConsumerGroupToolbarProps> = React.memo(
  ({ search, setSearch, total, page, perPage }) => {
    const { t } = useTranslation(['kafkaTemporaryFixMe']);
    const [searchInputValue, setSearchInputValue] = useState<string>('');

    const onClear = () => {
      setSearch('');
    };

    const onChangeInput = (value: string) => {
      setSearchInputValue(value);
    };

    const onSearch = () => {
      setSearch(searchInputValue);
      setSearchInputValue('');
    };

    const onDeleteChip = () => {
      setSearch('');
    };

    const toggleGroupItems = (
      <>
        <ToolbarFilter
          chips={search ? [search] : []}
          deleteChip={onDeleteChip}
          categoryName={''}
        >
          <InputGroup>
            <TextInput
              name='searchConsumerGroups'
              id='search-consumer-groups-input'
              type='search'
              aria-label={t('consumerGroup.consumer_group_search_input')}
              placeholder={t('common.search')}
              value={searchInputValue}
              onChange={onChangeInput}
            />
            <Button
              variant={ButtonVariant.control}
              isDisabled={searchInputValue.length ? false : true}
              onClick={onSearch}
              aria-label={t('consumerGroup.consumer_group_search')}
            >
              <SearchIcon />
            </Button>
          </InputGroup>
        </ToolbarFilter>
      </>
    );

    const toolbarItems: ToolbarItemProps[] = [];

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
  }
);

export { ConsumerGroupToolbar };
