import React, {
    FocusEventHandler, forwardRef, Fragment, KeyboardEventHandler, memo, useCallback, useMemo, useRef,
} from 'react';
import {
    IHasCX, IHasRawProps, cx, uuiMod, useForceUpdate,
    ICanBeInvalid,
    IDisableable,
    ICanBeReadonly,
    ICanBeRequired,
} from '@epam/uui-core';
import { ScrollBars } from '@epam/uui';
import {
    Plate, PlateContent, PlateEditor, PlatePlugin, Value, createPlugins, useComposedRef,
} from '@udecode/plate-common';

import { createPlateUI } from './components';
import { baseMarksPlugin } from './plugins';
import { Toolbars } from './implementation/Toolbars';
import { EditorValue, VersionedEditorValue } from './types';
import { defaultPlugins } from './defaultPlugins';

import css from './SlateEditor.module.scss';
import { getEditorValue, isEditorValueEmpty } from './helpers';
import { useFocusEvents } from './plugins/eventEditorPlugin/eventEditorPlugin';
import { createMigrationPlugin } from './plugins/migrationPlugin/migrationPlugin';

export const basePlugins: PlatePlugin[] = [
    ...baseMarksPlugin(),
    ...defaultPlugins,
];

const disabledPlugins = { insertData: true };

interface PlateEditorProps
    extends ICanBeInvalid,
    IDisableable,
    ICanBeReadonly,
    ICanBeRequired,
    IHasCX,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    value: EditorValue;
    onValueChange: (newValue: VersionedEditorValue) => void;
    plugins?: any[]; // TODO: improve typing
    isReadonly?: boolean;
    autoFocus?: boolean;
    minHeight?: number | 'none';
    placeholder?: string;
    mode?: 'form' | 'inline';
    fontSize?: '14' | '16';
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
    onBlur?: FocusEventHandler<HTMLDivElement>;
    onFocus?: FocusEventHandler<HTMLDivElement>;
    scrollbars?: boolean;
    toolbarPosition?: 'floating' | 'fixed';
}

export const SlateEditor = memo(forwardRef<HTMLDivElement, PlateEditorProps>((props, ref) => {
    const currentId = useRef(String(Date.now()));
    const editorRef = useRef<PlateEditor | null>(null);
    const editableWrapperRef = useRef<HTMLDivElement>();

    /** value */
    /** consider legacy slate to plate content migraions once. should be deprecated in the near future */
    /** consider newer plate migrations */
    const [plateValue, contentVersion] = useMemo(
        () => getEditorValue(props.value),
        [props.value],
    );

    const initialPlateValue: Value | undefined = useMemo(() => {
        const content = editorRef.current?.children;
        if (content) return content;

        return plateValue;
    }, [plateValue]);

    const { isReadonly, onValueChange } = props;
    const onChange = useCallback((v: Value) => {
        if (isReadonly) { // should not be event invoked, TODO: remove it
            return;
        }

        // emit versioned content
        onValueChange({
            version: contentVersion,
            content: v,
        });
    }, [contentVersion, isReadonly, onValueChange]);

    /** config */
    const plugins = useMemo(
        () => {
            const _plugins = [...(props.plugins || defaultPlugins), createMigrationPlugin(contentVersion)()];
            return createPlugins(_plugins.flat(), { components: createPlateUI() });
        },
        [contentVersion, props.plugins],
    );

    /** styles */
    const contentStyle = useMemo(() => ({ minHeight: props.minHeight }), [props.minHeight]);
    const editorWrapperClassNames = useMemo(() => cx(
        'uui-typography',
        props.cx,
        css.container,
        css['mode-' + (props.mode || 'form')],
        props.isReadonly && uuiMod.readonly,
        props.scrollbars && css.withScrollbars,
        props.fontSize === '16' ? 'uui-typography-size-16' : 'uui-typography-size-14',
    ), [props.cx, props.fontSize, props.isReadonly, props.mode, props.scrollbars]);

    /** focus management */
    /** TODO: move to plate */
    useFocusEvents({
        editorId: currentId.current,
        editorWrapperRef: editableWrapperRef,
        isReadonly: props.isReadonly,
    });

    const autoFocusRef = useCallback((node: HTMLDivElement) => {
        if (!editableWrapperRef.current && node) {
            editableWrapperRef.current = node;

            if (!props.isReadonly && props.autoFocus) {
                editableWrapperRef.current.classList.add(uuiMod.focus);
            }
        }
        return editableWrapperRef;
    }, [props.autoFocus, props.isReadonly]);
    const composedRef = useComposedRef(autoFocusRef, ref);

    /** render related */
    const renderEditable = useCallback(() => {
        return (
            <Fragment>
                <PlateContent
                    id={ currentId.current }
                    autoFocus={ props.autoFocus }
                    readOnly={ props.isReadonly }
                    className={ css.editor }
                    onKeyDown={ props.onKeyDown }
                    onBlur={ props.onBlur }
                    onFocus={ props.onFocus }
                    placeholder={ editorRef.current
                        && isEditorValueEmpty(editorRef.current.children)
                        ? props.placeholder : undefined }
                    style={ contentStyle }
                />
                <Toolbars toolbarPosition={ props.toolbarPosition } />
            </Fragment>
        );
    }, [props.autoFocus, contentStyle, props.isReadonly, props.onBlur, props.onFocus, props.onKeyDown, props.placeholder, props.toolbarPosition]);

    /** could not be memoized, since slate is uncontrolled component */
    const editorContent = props.scrollbars
        ? <ScrollBars cx={ css.scrollbars }>{ renderEditable() }</ScrollBars>
        : renderEditable();

    /** force update of uncontrolled component */
    const forceUpdate = useForceUpdate();
    if (plateValue && editorRef.current && editorRef.current.children !== plateValue) {
        editorRef.current.children = plateValue;
        forceUpdate();
    }

    return (
        <Plate
            id={ currentId.current }
            initialValue={ initialPlateValue }
            normalizeInitialValue // invokes plate migrations
            plugins={ plugins }
            onChange={ onChange }
            editorRef={ editorRef }
            disableCorePlugins={ disabledPlugins }
        >
            <div
                ref={ composedRef }
                className={ editorWrapperClassNames }
                { ...props.rawProps }
            >
                {editorContent}
            </div>
        </Plate>
    );
}));
