import { useCallback, useMemo, useState } from 'react';
import { PlainTreeProps } from './types';
import { useCreateTree } from './useCreateTree';
import { useFilterTree } from './useFilterTree';
import { useSearchTree } from './useSearchTree';
import { useSortTree } from './useSortTree';
import { UseTreeResult } from '../../types';
import { useDataSourceStateWithDefaults } from '../useDataSourceStateWithDefaults';
import { useItemsStorage } from '../useItemsStorage';

export function usePlainTree<TItem, TId, TFilter = any>(
    { sortSearchByRelevance = true, items, ...restProps }: PlainTreeProps<TItem, TId, TFilter>,
    deps: any[],
): UseTreeResult<TItem, TId, TFilter> {
    const props = { ...restProps, sortSearchByRelevance };
    const [trigger, setTrigger] = useState(false);

    const resetTree = useCallback(() => {
        setTrigger((currentTrigger) => !currentTrigger);
    }, [setTrigger]);

    const { itemsMap, itemsStatusMap, setItems } = useItemsStorage({
        itemsMap: restProps.itemsMap,
        itemsStatusMap: restProps.itemsStatusMap,
        items,
        setItems: restProps.setItems,
        params: { getId: restProps.getId, complexIds: restProps.complexIds },
    });

    const fullTree = useCreateTree(
        { ...props, items, itemsMap, itemsStatusMap, setItems },
        [...deps, items, itemsMap, itemsStatusMap, trigger],
    );

    const {
        getId,
        getParentId,
        getFilter,
        getSearchFields,
        sortBy,
        rowOptions,
        getRowOptions,
        setDataSourceState,
    } = props;

    const dataSourceState = useDataSourceStateWithDefaults({ dataSourceState: props.dataSourceState });

    const filteredTree = useFilterTree(
        { tree: fullTree, getFilter, dataSourceState },
        [fullTree],
    );

    const sortTree = useSortTree(
        { tree: filteredTree, sortBy, dataSourceState },
        [filteredTree],
    );

    const tree = useSearchTree(
        { tree: sortTree, getSearchFields, sortSearchByRelevance, dataSourceState },
        [sortTree],
    );

    const getChildCount = useCallback((item: TItem): number | undefined => {
        if (props.getChildCount) {
            return props.getChildCount(item) ?? tree.visible.getChildren(getId(item)).length;
        }
        return tree.visible.getChildren(getId(item)).length;
    }, [tree.visible, getId, props.getChildCount]);

    const reload = useCallback(() => {
        resetTree();
    }, [resetTree]);

    const totalCount = useMemo(() => {
        const { totalCount: rootTotalCount } = tree.visible.getItems(undefined);

        return rootTotalCount ?? tree.visible.getTotalCount?.() ?? 0;
    }, [tree.visible]);

    return useMemo(
        () => ({
            tree: tree.visible,
            selectionTree: tree.full,
            totalCount,
            rowOptions,
            getRowOptions,
            getChildCount,
            getParentId,
            getId,
            dataSourceState,
            setDataSourceState,
            reload,
        }),
        [
            tree,
            dataSourceState,
            setDataSourceState,
            rowOptions,
            getRowOptions,
            dataSourceState,
            getChildCount,
            getParentId,
            getId,
        ],
    );
}
