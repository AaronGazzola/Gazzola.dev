import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { EditorState, LexicalEditor } from "lexical";
import { useEffect } from "react";
import SendIcon from "../SendIcon";
import useEditor from "./hooks/useEditor";
import EnterPlugin from "./plugins/EnterPlugin";

export type OnEditorChange = (
  editorState: EditorState,
  editor: LexicalEditor,
  tags: Set<string>
) => void;

const ReadOnlyPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(false);
  }, [editor]);

  return null;
};

const Editor = ({
  onChange,
  onEmit,
  message,
}: {
  onChange: OnEditorChange;
  onEmit: () => void;
  message: string;
}) => {
  const { isFocused, contentEditableProps } = useEditor();
  const messageIsEmpty = message === "";

  return (
    <div className="pt-4 px-5 pb-5 relative">
      <div
        className={[
          "relative border rounded p-2 text-lg sm:text-xl flex items-center",
          isFocused ? "border-gray-400" : "border-gray-700",
        ].join(" ")}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="pl-3 py-1 focus:outline-none grow"
              {...contentEditableProps}
            />
          }
          placeholder={
            <div className="-z-10 absolute top-3 left-6 text-gray-400 italic">
              Chat coming soon...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} />
        <EnterPlugin onEmit={onEmit} />
        <ReadOnlyPlugin />
        <button
          disabled={messageIsEmpty}
          type="button"
          className={[messageIsEmpty ? "opacity-50" : ""].join(" ")}
          onClick={() => onEmit()}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default Editor;
