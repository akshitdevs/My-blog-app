import React from "react";

function Input({ label, type = "text", ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type={type}
        className="bg-black border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-white transition"
        {...props}
      />
    </div>
  );
}

export default Input;