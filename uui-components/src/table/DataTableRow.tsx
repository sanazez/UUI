import React, { ReactNode } from 'react';
import isEqual from 'react-fast-compare';
import {
    DataColumnProps, DataRowProps, uuiMod, DndActorRenderParams, DndActor, uuiMarkers, DataTableRowProps, Lens, IEditable,
    DndDropLevelsRenderParams,
} from '@epam/uui-core';
import { DataTableRowContainer } from './DataTableRowContainer';
import { FlexRow } from '../layout';
import css from './DataTableRow.module.scss';

const uuiDataTableRow = {
    uuiTableRow: 'uui-table-row',
} as const;

function compareProps(props: any, nextProps: any) {
    const isDeepEqual = isEqual(props, nextProps);

    // Debug code to find props differences. Please don't remove, and keep commented out
    // //
    // const shallowDiffKeys = [];
    // const compareDeep = (left: any, right: any, prefix = "") => {
    //     if (prefix.length > 1000) {
    //         return; // cyclic references?
    //     } else if (left && right) {
    //         const keys = Object.keys({ ...left, ...right });
    //         keys.forEach(key => {
    //             if (left[key] !== right[key]) {
    //                 shallowDiffKeys.push({ path: prefix + key, left: left[key], right: right[key] });
    //                 compareDeep(left[key], right[key], prefix + key + '.');
    //             }
    //         });
    //     } else {
    //         shallowDiffKeys.push({ path: prefix, left: left, right: right });
    //     }
    // }
    // compareDeep(this.props, nextProps);
    return isDeepEqual;
}

const DataTableRowImpl = React.forwardRef(function DataTableRow<TItem, TId>(props: DataTableRowProps<TItem, TId>, ref: React.ForwardedRef<HTMLDivElement>) {
    const rowLens = Lens.onEditable(props as IEditable<TItem>);

    const renderCell = (column: DataColumnProps<TItem, TId>, idx: number) => {
        const renderCellCallback = column.renderCell || props.renderCell;
        const isFirstColumn = idx === 0;
        const isLastColumn = !props.columns || idx === props.columns.length - 1;
        return renderCellCallback?.({
            key: column.key,
            column,
            rowProps: props,
            index: idx,
            isFirstColumn,
            isLastColumn,
            rowLens,
        });
    };

    const renderDropLevels = (params: DndDropLevelsRenderParams<TId> & { size: string }) => {
        return (
            <FlexRow
                cx={ [css.container] }
            >
                { [...params.path, params.id].map((id, index) => props.renderDropLevel({
                    ...params,
                    row: props,
                    id,
                    level: index + 1,
                    key: `${id}-bottom`,
                    position: 'bottom',
                })) }

                { props.renderDropLevel({
                    ...params,
                    row: props,
                    id: params.id,
                    level: params.path.length + 2,
                    key: `${params.id}-inside`,
                    position: 'inside',
                }) }
            </FlexRow>
        );
    };

    const renderRow = (params: Partial<DndActorRenderParams>, clickHandler?: (props: DataRowProps<TItem, TId>) => void, overlays?: ReactNode) => {
        return (
            <DataTableRowContainer
                columns={ props.columns }
                ref={ params.ref || ref }
                renderCell={ renderCell }
                onClick={ clickHandler && (() => clickHandler(props)) }
                rawProps={ {
                    ...props.rawProps,
                    ...params.eventHandlers,
                    role: 'row',
                    'aria-expanded': (props.isFolded === undefined || props.isFolded === null) ? undefined : !props.isFolded,
                    ...(props.isSelectable && { 'aria-selected': props.isSelected }),
                } }
                cx={ [
                    params.classNames,
                    props.isSelected && uuiMod.selected,
                    params.isDraggable && uuiMarkers.draggable,
                    props.isInvalid && uuiMod.invalid,
                    uuiDataTableRow.uuiTableRow,
                    props.cx,
                    props.isFocused && uuiMod.focus,
                ] }
                overlays={ overlays }
                link={ props.link }
            />
        );
    };

    const clickHandler = props.onClick || props.onSelect || props.onFold || props.onCheck;

    if (props.dnd && (props.dnd.srcData || props.dnd.canAcceptDrop)) {
        return (
            <DndActor
                isMultilevel={ true }
                { ...props.dnd }
                id={ props.id }
                path={ props.path.map(({ id }) => id) }
                render={ (params, overlays) => renderRow(params, clickHandler, overlays) }
                renderDropLevels={ props.renderDropLevel ? renderDropLevels : null }
            />
        );
    } else {
        return renderRow({}, clickHandler);
    }
});

export const DataTableRow = React.memo(DataTableRowImpl, compareProps);
