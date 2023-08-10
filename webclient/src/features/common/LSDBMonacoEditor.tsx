import { InputLabel } from "@material-ui/core";
import React from "react";
import Editor from "@monaco-editor/react";

const LSDBMonacoEditor: React.FC<{
  title: string;
  editorHeight?: string;
  editorLanguage: string;
  value?: string;
  onChangeCb: (value: any) => any;
}> = ({
  title,
  editorHeight = "30vh",
  editorLanguage,
  value = "",
  onChangeCb,
}) => {
  return (
    <div style={{ paddingBottom: 32 }}>
      <InputLabel>{title}</InputLabel>
      <Editor
        height={editorHeight}
        language={editorLanguage}
        theme="vs-dark"
        value={value}
        onChange={onChangeCb}
      />
    </div>
  );
};

export default LSDBMonacoEditor;
