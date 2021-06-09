import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputGroup, SearchInput } from '@patternfly/react-core';
import { MASToolbar, ToolbarItemProps, MASPagination } from '@app/components';

export type ConsumerGroupToolbarProps = {
  setSearch: (value: string) => void;
  search: string;
  total: number;
  page: number;
  perPage: number;
};

const ConsumerGroupToolbar: React.FC<ConsumerGroupToolbarProps> = ({
  search,
  setSearch,
  total,
  page,
  perPage,
}) => {
  const { t } = useTranslation();

  const onClear = () => {
    setSearch('');
  };

  const onChangeInput = (value: string) => {
    setSearch(value);
  };

  const toggleGroupItems = (
    <InputGroup>
      <SearchInput
        name='searchName'
        id='search-consumers-input'
        type='search'
        aria-label={t('consumerGroup.search')}
        placeholder={t('common.search')}
        value={search}
        onChange={onChangeInput}
        onClear={onClear}
      />
    </InputGroup>
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
};

export { ConsumerGroupToolbar };
