import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

function RTE({ value, onChange }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full min-h-[400px] rounded border border-gray-700 overflow-hidden">
      {/* 🔹 Shadow overlay while editor is loading */}
      {loading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 animate-pulse">
          <div className="text-white text-center">
            Loading editor...
          </div>
        </div>
      )}

      {/* 🔹 TinyMCE Editor */}
      <Editor
        apiKey="uey8v5o56lv6pjuuvb4b3xpcpfsj0xmzybx6yq116vfzsyw8"
        value={value}
        onEditorChange={onChange}
        init={{
          height: 400,
          menubar: false,
          skin: "oxide-dark",
          content_css: "dark",
          plugins: ["link", "image", "lists", "code", "table"],
          toolbar:
            "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | code",
          mobile: {
            menubar: false,
            toolbar: "undo redo | bold italic | bullist numlist | link",
          },
          toolbar_mode: "sliding",
          browser_spellcheck: true,
          contextmenu: false,
          setup: (editor) => {
            // 🔹 Hide overlay when editor is ready
            editor.on("init", () => setLoading(false));
          },
        }}
      />
    </div>
  );
}

export default RTE;