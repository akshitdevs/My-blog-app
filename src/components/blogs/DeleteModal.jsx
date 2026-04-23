// components/blogs/DeleteModal.jsx

import React from "react";

function DeleteModal({ deleteModal, setDeleteModal, handleDelete, deleting }) {
    if (!deleteModal.open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            style={{ animation: "fadeIn 0.2s ease" }}
        >
            <div
                className="bg-gray-900 border border-gray-700/60 rounded-2xl p-6 w-[88%] max-w-sm shadow-2xl"
                style={{
                    animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                }}
            >
                <h2 className="text-base font-semibold mb-1">
                    Delete post?
                </h2>

                <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                    This action cannot be undone.
                </p>

                <div className="flex justify-end gap-2">
                    {/* Cancel */}
                    <button
                        onClick={() =>
                            setDeleteModal({ open: false, postId: null })
                        }
                        disabled={deleting}
                        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm
            hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>

                    {/* Delete */}
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm
            hover:bg-red-500 transition-colors flex items-center gap-2 cursor-pointer
            disabled:opacity-60"
                    >
                        {deleting ? "Deleting…" : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;