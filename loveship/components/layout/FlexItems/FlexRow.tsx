import * as types from '../../types';
import css from './FlexRow.scss';
import { FlexRowProps, withMods } from '@epam/uui-core';
import { FlexRow as uuiFlexRow } from '@epam/uui-components';

export interface RowMods extends types.RowSizeMod {
    background?: 'white' | 'night50' | 'night100' | 'none';
    borderBottom?: boolean | 'night50' | 'night400' | 'night700' | 'night300';
    columnGap?: number;
    margin?: '12' | '24';
    padding?: '6' | '12' | '18' | '24';
    rowGap?: number;
    spacing?: '6' | '12' | '18' | null;
    topShadow?: boolean;
    type?: 'form' | 'panel';
    vPadding?: '12' | '18' | '24' | '36' | '48';
}

const commonDefaults: RowMods & FlexRowProps = {
    size: '36',
    background: 'none',
};

const rowTypesDefaults: Record<string, RowMods & FlexRowProps> = {
    form: {
        ...commonDefaults,
        spacing: '12',
        alignItems: 'top',
        vPadding: '18',
        padding: '24',
    },
    panel: {
        ...commonDefaults,
        alignItems: 'center',
        spacing: '6',
        size: '36',
    },
};

export const FlexRow = withMods<FlexRowProps, RowMods & FlexRowProps>(uuiFlexRow, props => {
    const defaults = rowTypesDefaults[props.type || 'panel'];
    props = { ...defaults, ...props };

    return [
        css.root,
        props.size !== null && css['size-' + (props.size || '36')],
        css['background-' + props.background],
        props.padding && css['padding-' + props.padding],
        props.vPadding && css['vPadding-' + props.vPadding],
        props.margin && css['margin-' + props.margin],
        props.topShadow && css.topShadow,
        props.borderBottom && (props.borderBottom === true ? css['border-bottom-night400'] : css['border-bottom-' + props.borderBottom]),
        css['spacing-' + props.spacing],
    ];
},
props => {
    const styles: {columnGap?: string; rowGap?: string} = {};
    if (props.columnGap) {
        styles.columnGap = `${ props.columnGap }px`;
    } else if (props.rowGap) {
        styles.rowGap = `${ props.rowGap }px`;
    }

    if (props.columnGap || props.rowGap) {
        return {rawProps: {
            style: styles,
        }};
    }
});
