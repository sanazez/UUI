import {
    createInsertDataPlugin,
    findEventRange,
    select,
} from "@udecode/plate";
import { UploadFileOptions, createFileUploader } from "./file_uploader";

export const uploadFilePlugin = (uploadOptions?: UploadFileOptions) =>
    createInsertDataPlugin({
        options: { uploadOptions },
        handlers: {
            onDrop: (editor, plugin) => {
                const uploadFiles = createFileUploader(editor, plugin.options.uploadOptions);
                return (event) => {
                    const { files } = event.dataTransfer;
                    if (files.length === 0) return false;

                    event.preventDefault();
                    event.stopPropagation();

                    // update drop location depending on cursor
                    const at = findEventRange(editor, event);
                    if (!at) return false;
                    select(editor, at);

                    uploadFiles(Array.from(files));

                    return true;
                };
            },
            onPaste: (editor, plugin) => {
                const uploadFiles = createFileUploader(editor, plugin.options.uploadOptions);
                return (event) => {
                    const { files } = event.clipboardData;
                    if (files.length === 0) return false;

                    event.preventDefault();
                    event.stopPropagation();

                    uploadFiles(Array.from(files), plugin.options.uploadOptions);

                    return true;
                };
            },
        },
    });
