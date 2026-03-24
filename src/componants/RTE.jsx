// components/RTE.jsx
import React from "react";
import { Editor } from "@tinymce/tinymce-react";

function RTE({ value, onChange }) {
  return (
    <Editor
      apiKey="uey8v5o56lv6pjuuvb4b3xpcpfsj0xmzybx6yq116vfzsyw8" // works fine locally
      value={value}
      onEditorChange={onChange}
      init={{
        height: 400,
        menubar: false,
        skin: "oxide-dark",
        content_css: "dark",
        plugins: [
          "link",
          "image",
          "lists",
          "code",
          "table",
        ],
        toolbar:
          "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code",
      }}
    />
  );
}

export default RTE;