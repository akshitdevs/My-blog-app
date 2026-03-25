// pages/Blogs.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import databaseServices from "../appwrite/config";
import storageServices from "../appwrite/storage";
import { FaEye } from "react-icons/fa";

function Blogs() {
  const user = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("latest");
  const [loading, setLoading] = useState(false);
  const [animatePage, setAnimatePage] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Fetch posts
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
    setTimeout(() => setAnimatePage(true), 50);
  }, []);

  // Format date
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // Delete post
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await databaseServices.deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.$id !== postId));
      alert("Post deleted successfully!");
    } catch (err) {
      console.log("Delete error:", err);
      alert("Failed to delete the post.");
    }
  };

  // Filter with animation
  const handleFilter = (f) => {
    setAnimatePage(false);
    setTimeout(() => {
      setFilter(f);
      setAnimKey((prev) => prev + 1);
      setAnimatePage(true);
    }, 150);
  };

  // Filter & sort posts
  const filteredPosts = posts
    .filter((post) => {
      if (filter === "my") return post.userId === user?.$id;
      if (filter === "today")
        return new Date(post.$createdAt).toDateString() ===
          new Date().toDateString();
      return true;
    })
    .sort((a, b) => {
      if (filter === "latest")
        return new Date(b.$createdAt) - new Date(a.$createdAt);
      if (filter === "mostViewed") return (b.views || 0) - (a.views || 0);
      return 0;
    });

  return (
    <div
      className={`bg-black text-white min-h-screen px-4 py-6 transition-opacity duration-500 ease-in-out
        ${animatePage ? "opacity-100" : "opacity-0"}`}
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-gray-800 px-4 py-3 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-3 transition-all">
        <h1 className="text-xl font-semibold">Blogs</h1>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {["latest", "today", "mostViewed", "my"].map((f) => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`px-3 py-1.5 text-sm rounded transition cursor-pointer
                ${filter === f
                  ? "bg-amber-400 text-black font-medium"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              {f === "latest"
                ? "Latest"
                : f === "today"
                ? "Today"
                : f === "mostViewed"
                ? "Most Viewed"
                : "My Blogs"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        key={animKey}
        className="flex flex-col gap-4 md:grid md:grid-cols-3 mt-4 transition-all duration-300 ease-in-out"
      >
        {loading && (
          <div className="text-gray-400 text-center col-span-full">
            Loading posts...
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <p className="text-gray-400 text-center col-span-full mt-10">
            {filter === "my"
              ? "You haven't written any blogs yet."
              : "No posts found."}
          </p>
        )}

        {!loading &&
          filteredPosts.map((post) => {
            const isOwner = user?.$id === post.userId;

            return (
              <div
                key={post.$id}
                className="flex md:flex-col bg-gray-900 border border-gray-800 rounded-lg overflow-hidden relative
                group transition-transform duration-300 ease-out hover:scale-105 hover:shadow-lg"
              >
                {/* Main clickable area */}
                <NavLink
                  to={`/post/${post.$id}`}
                  className="flex md:flex-col flex-1 cursor-pointer"
                >
                  {post.featuredImage && (
                    <div className="overflow-hidden">
                      <img
                        src={storageServices.getFileView(post.featuredImage)}
                        alt={post.title}
                        className="w-32 h-28 md:w-full md:h-40 object-cover transition-transform duration-300 ease-out group-hover:scale-110 group-hover:opacity-90"
                      />
                    </div>
                  )}

                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-sm md:text-lg font-semibold line-clamp-1 group-hover:underline transition-colors duration-200">
                        {post.title}
                      </h2>
                      <p className="text-xs text-gray-400">
                        {post.uploaderName || "Unknown"} •{" "}
                        {formatDate(post.$createdAt)}
                      </p>
                      {post.$updatedAt !== post.$createdAt && (
                        <p className="text-xs text-gray-500">
                          Updated {formatDate(post.$updatedAt)}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                        {post.content.replace(/<[^>]+>/g, "").slice(0, 80)}...
                      </p>
                    </div>

                    {/* Views */}
                    <div className="flex justify-start items-center mt-2 text-xs text-gray-300 gap-1">
                      <FaEye /> {post.views || 0}
                    </div>
                  </div>
                </NavLink>

                {/* Owner actions: only show if filter is "my" */}
                {isOwner && filter === "my" && (
                  <div className="absolute top-2 right-2 flex gap-2 text-xs z-10">
                    <NavLink
                      to={`/edit/${post.$id}`}
                      className="text-amber-400 bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 transition-colors duration-200"
                    >
                      Edit
                    </NavLink>
                    <button
                      onClick={() => handleDelete(post.$id)}
                      className="text-red-500 bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Blogs;