import React from "react";

function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;