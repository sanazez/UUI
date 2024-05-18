import {
    PlatePlugin,
    Value,
    createNode,
    deserializeHtml,
    parseHtmlDocument,
} from '@udecode/plate-common';
import { serializeHtml } from '@udecode/plate-serializer-html';
import { EditorValue } from './types';
import {
    baseMarksPlugin,
    headerPlugin,
    superscriptPlugin,
    listPlugin,
    quotePlugin,
    linkPlugin,
    imagePlugin,
    videoPlugin,
    iframePlugin,
    codeBlockPlugin,
    paragraphPlugin,
    boldPlugin,
    italicPlugin,
    PARAGRAPH_TYPE,
} from './plugins';
import { createTempEditor, initializeEditor } from './helpers';
import { createDeserializeMdPlugin, deserializeMd } from './plugins/deserializeMdPlugin';
import { serializeMd } from '@udecode/plate-serializer-md';

type SerializerType = 'html' | 'md';

export const htmlSerializationsWorkingPlugins: PlatePlugin[] = [
    ...baseMarksPlugin(),
    paragraphPlugin(),
    headerPlugin(),
    superscriptPlugin(),
    listPlugin(),
    quotePlugin(),
    linkPlugin(),
    imagePlugin(),
    videoPlugin(),
    iframePlugin(),
    codeBlockPlugin(),
];

export const mdSerializationsWorkingPlugins: PlatePlugin[] = [
    createDeserializeMdPlugin(),
    boldPlugin(),
    italicPlugin(),
    paragraphPlugin(),
    linkPlugin(),
    listPlugin(),
    headerPlugin(),
    // quotePlugin,
    // separatorPlugin,
    // inlineCodePlugin
    // underline
    // image
    // strikethrough
    // superscript
    // subscript
    // code blocks
    // tables
];

export const createDeserializer = (type: SerializerType = 'html') => {
    if (type === 'html') {
        const editor = createTempEditor(htmlSerializationsWorkingPlugins);
        return (data: string) => {
            const document = parseHtmlDocument(data);
            return deserializeHtml(editor, { element: document.body }) as EditorValue;
        };
    } else {
        const editor = createTempEditor(mdSerializationsWorkingPlugins);
        return (data: string) => {
            editor.children = deserializeMd<Value>(editor, data);
            editor.normalize({ force: true });

            // escape from invalid empty state
            return !!editor.children.length
                ? (editor.children as EditorValue)
                : [createNode(PARAGRAPH_TYPE)];
        };
    }
};

export const createSerializer = (type: SerializerType = 'html') => {
    if (type === 'html') {
        const editor = createTempEditor(htmlSerializationsWorkingPlugins);
        return (v: EditorValue) => {
            const value = initializeEditor(editor, v);
            return serializeHtml(editor, { nodes: value });
        };
    } else {
        const editor = createTempEditor(mdSerializationsWorkingPlugins);
        return (v: EditorValue) => {
            const value = initializeEditor(editor, v);

            return serializeMd(editor, { nodes: value });
        };
    }
};
