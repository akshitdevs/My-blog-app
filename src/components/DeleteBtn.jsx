// componants/DeleteButton.jsx
import React from "react";
import { useSelector } from "react-redux";
import databaseServices from "../appwrite/config";
import { useNavigate } from "react-router-dom";

function DeleteButton({ postId, postUserId }) {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData);

  // Only show the button if the logged-in user is the post owner
  if (!currentUser || currentUser.$id !== postUserId) return null;

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    try {
      await databaseServices.deletePost(postId);
      alert("Post deleted successfully!");
      navigate("/blogs"); // redirect after deletion
    } catch (err) {
      console.log("Delete error:", err);
      alert("Failed to delete the post.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
    >
      Delete
    </button>
  );
}

export default DeleteButton;