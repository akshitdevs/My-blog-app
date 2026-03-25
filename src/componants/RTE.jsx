import React from "react";
import { Editor } from "@tinymce/tinymce-react";

function RTE({ value, onChange }) {
  return (
    <Editor
      apiKey="uey8v5o56lv6pjuuvb4b3xpcpfsj0xmzybx6yq116vfzsyw8"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 400,
        menubar: false,

        // Works on both devices
        skin: "oxide-dark",
        content_css: "dark",

        plugins: ["link", "image", "lists", "code", "table"],

        toolbar:
          "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | code",

        // 👇 KEY PART (mobile support)
        mobile: {
          menubar: false,
          toolbar:
            "undo redo | bold italic | bullist numlist | link",
        },

        // 👇 improves touch behavior
        toolbar_mode: "sliding",

        // 👇 prevents weird focus bugs on mobile
        browser_spellcheck: true,

        // 👇 makes typing smoother on phones
        contextmenu: false,
      }}
    />
  );
}

export default RTE;