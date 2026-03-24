// pages/Blogs.jsx
import React, { useEffect, useState } from "react";
import databaseServices from "../appwrite/config";
import storageServices from "../appwrite/storage";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

function Blogs() {
  const user = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("explore"); // "explore" or "my"
  const [loading, setLoading] = useState(false);

  // Fetch all posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await databaseServices.getAllPost();
      if (res) setPosts(res.documents);
    } catch (err) {
      console.log("Fetch posts error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Delete post
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await databaseServices.deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.$id !== postId));
      alert("Post deleted successfully!");
    } catch (err) {
      console.log("Delete error:", err);
      alert("Failed to delete the post.");
    }
  };

  // Filter posts based on selected tab
  const filteredPosts =
    filter === "my"
      ? posts.filter((post) => post.userId === user?.$id)
      : posts.filter((post) => post.status === "active");

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Blogs</h1>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setFilter("explore")}
          className={`px-4 py-2 rounded ${
            filter === "explore"
              ? "bg-amber-400 text-black font-semibold"
              : "bg-gray-800 text-white"
          }`}
        >
          Explore
        </button>

        <button
          onClick={() => setFilter("my")}
          className={`px-4 py-2 rounded ${
            filter === "my"
              ? "bg-amber-400 text-black font-semibold"
              : "bg-gray-800 text-white"
          }`}
        >
          My Blogs
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-400 col-span-full">
          Loading posts...
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const isOwner = user?.$id === post.userId;

          return (
            <div
              key={post.$id}
              className="border border-gray-800 rounded overflow-hidden flex flex-col"
            >
              {/* Image */}
              {post.featuredImage && (
                <img
                  src={storageServices.getfileview(post.featuredImage)}
                  alt={post.title}
                  className="h-40 w-full object-cover"
                />
              )}

              {/* Content */}
              <div className="p-4 flex flex-col gap-2 grow">
                <h2 className="text-lg font-semibold">{post.title}</h2>

                {/* Uploader Name */}
                <p className="text-gray-400 text-sm">
                  By: {post.uploaderName || "Unknown"}
                </p>

                {/* Preview */}
                <p className="text-gray-400 text-sm line-clamp-3">
                  {post.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
                </p>

                {/* Buttons */}
                <div className="mt-auto flex justify-between items-center gap-2">
                  <NavLink
                    to={`/post/${post.$id}`}
                    className="text-sm hover:underline"
                  >
                    Read
                  </NavLink>

                  {isOwner && (
                    <div className="flex gap-2">
                      {/* Edit link */}
                      <NavLink
                        to={`/edit/${post.$id}`}
                        className="text-sm text-amber-400 hover:underline"
                      >
                        Edit
                      </NavLink>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(post.$id)}
                        className="text-sm cursor-pointer text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredPosts.length === 0 && !loading && (
          <p className="text-gray-400 col-span-full text-center mt-10">
            {filter === "my"
              ? "You haven't written any blogs yet."
              : "No blogs to explore yet."}
          </p>
        )}
      </div>
    </div>
  );
}

export default Blogs;