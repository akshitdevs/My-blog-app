// components/LoadingOverlay.jsx
import React from "react";

function LoadingOverlay({ message = "Please wait..." }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-md flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-center">{message}</p>
      </div>
    </div>
  );
}

export default LoadingOverlay;