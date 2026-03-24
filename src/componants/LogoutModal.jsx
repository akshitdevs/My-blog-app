// componants/LogoutModal.jsx
import React from "react";

function LogoutModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black text-white p-6 rounded-lg shadow-lg w-80 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-center">Confirm Logout</h2>
        <p className="text-gray-400 text-sm text-center">
          Are you sure you want to log out?
        </p>

        <div className="flex justify-between gap-4 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer py-2 bg-gray-800 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 cursor-pointer py-2 bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;