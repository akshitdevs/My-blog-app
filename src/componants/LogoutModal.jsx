import React from "react";
import { createPortal } from "react-dom";

function LogoutModal({ isOpen, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm 
                    transition-opacity duration-300">

      <div className="absolute top-1/2 left-1/2 w-[90%] max-w-sm 
      -translate-x-1/2 -translate-y-1/2">

        <div className="bg-black text-white p-6 rounded-xl shadow-xl flex flex-col gap-4 
                        transition-all duration-300 scale-100">

          <h2 className="text-lg font-semibold text-center">
            Confirm Logout
          </h2>

          <p className="text-gray-400 text-sm text-center">
            Are you sure you want to log out?
          </p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-2 cursor-pointer rounded bg-gray-800 
                         hover:bg-gray-700 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2 cursor-pointer rounded bg-red-500 
                         hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}

export default LogoutModal;