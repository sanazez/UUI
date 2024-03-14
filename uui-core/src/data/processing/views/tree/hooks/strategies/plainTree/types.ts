import { PatchItemsOptions } from '../../../../../../../types';
import { ItemsStorage } from '../../../ItemsStorage';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig, FilterConfig, SearchConfig, SortConfig } from '../types/common';

export type PlainTreeProps<TItem, TId, TFilter> =
    CommonDataSourceConfig<TItem, TId, TFilter>
    & PatchItemsOptions<TItem, TId>
    & SearchConfig<TItem>
    & SortConfig<TItem>
    & FilterConfig<TItem, TFilter>
    & {
        /**
         * Type of the tree to be supported.
         */
        type: typeof STRATEGIES.plain;

        /**
         * Data, which should be represented by a DataSource.
         */
        items?: TItem[];

        setItems?: ItemsStorage<TItem, TId>['setItems'],
    };
