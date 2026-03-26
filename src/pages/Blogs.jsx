// pages/Blogs.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Query } from "appwrite";
import databaseServices from "../appwrite/config";
import storageServices from "../appwrite/storage";
import { FaEye } from "react-icons/fa";
import { createPortal } from "react-dom";
function Blogs() {
  const [deleteModal, setDeleteModal] = useState({
  open: false,
  postId: null,
});

const [deleting, setDeleting] = useState(false);
  const user = useSelector((state) => state.auth.userData);

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("latest");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [animatePage, setAnimatePage] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // 🔥 FETCH POSTS (FIXED PROPERLY)
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user && filter === "my") return;

      setLoading(true);
      try {
        let res;

        if (filter === "my") {
          // fetch ALL user posts (private + public)
          res = await databaseServices.getAllPost([
            Query.equal("userId", user.$id),
          ]);
        } else {
          // fetch ONLY public posts
          res = await databaseServices.getAllPost([
            Query.equal("status", "public"),
          ]);
        }

        setPosts(res?.documents || []);
      } catch (err) {
        console.log("Fetch posts error:", err);
        setPosts([]);
      }
      setLoading(false);
    };

    fetchPosts();
    setTimeout(() => setAnimatePage(true), 50);
  }, [filter, user]);

  // Format date
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // DELETE FIXED (NO NAVIGATION BUG)
const handleDelete = async () => {
  if (!deleteModal.postId) return;

  setDeleting(true);
  try {
    await databaseServices.deletePost(deleteModal.postId);

    setPosts((prev) =>
      prev.filter((p) => p.$id !== deleteModal.postId)
    );

    setDeleteModal({ open: false, postId: null });
  } catch (err) {
    console.log("Delete error:", err);
  }
  setDeleting(false);
};

  // FILTER ANIMATION
  const handleFilter = (f) => {
    setAnimatePage(false);
    setTimeout(() => {
      setFilter(f);
      setAnimKey((prev) => prev + 1);
      setAnimatePage(true);
    }, 150);
  };

  // 🔥 FINAL FILTER LOGIC (SAFE + CLEAN)
const filteredPosts = posts
  .filter((post) => {
    const status = (post.status || "public").toLowerCase();
    const isOwner = post.userId === user?.$id;

    // hide private posts for others
    if (!isOwner && status === "private") return false;

    // ✅ TODAY CONDITION
    if (filter === "today") {
      const isToday =
        new Date(post.$createdAt).toDateString() ===
        new Date().toDateString();

      if (!isToday) return false;
    }

    // ✅ SEARCH CONDITION (ALWAYS APPLIES)
    if (search.trim()) {
      const s = search.toLowerCase();

      const match =
        post.title?.toLowerCase().includes(s) ||
        post.content
          ?.replace(/<[^>]+>/g, "")
          .toLowerCase()
          .includes(s) ||
        post.uploaderName?.toLowerCase().includes(s);

      if (!match) return false;
    }

    return true;
  })
  .sort((a, b) => {
    if (filter === "latest")
      return new Date(b.$createdAt) - new Date(a.$createdAt);

    if (filter === "mostViewed")
      return (b.views || 0) - (a.views || 0);

    return 0;
  });
  return (
    <div
      className={`bg-black text-white min-h-screen px-4 py-6 
      transition-all duration-500 ease-in-out
      ${animatePage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
    >
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-gray-800 px-4 py-3 flex flex-col gap-3">

        <div>
          <h1 className="text-xl font-semibold">Blogs</h1>
          {filter !== "my" && (
            <p className="text-gray-400 text-xs mt-1">
              Switch to{" "}
              <span className="text-amber-400 font-medium">
                My Blogs
              </span>{" "}
              to manage your posts.
            </p>
          )}
        </div>

        {/* SEARCH */}
        <div className="flex w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search blogs, users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-l outline-none focus:ring-2 focus:ring-amber-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="bg-amber-400 text-black px-3 rounded-r cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 flex-wrap">
          {["latest", "today", "mostViewed", "my"].map((f) => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`px-3 py-1.5 text-sm rounded cursor-pointer transition
              ${
                filter === f
                  ? "bg-amber-400 text-black"
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

      {/* POSTS */}
   <div
  key={animKey}
  className="flex flex-col gap-4 md:grid md:grid-cols-3 mt-4 pb-24"
>
        {loading && (
          <div className="text-gray-500 text-center col-span-full animate-pulse">
            Loading posts...
          </div>
        )}
        {!loading && filteredPosts.length === 0 && (
  <div className="col-span-full flex flex-col items-center justify-center mt-16 text-center">
    
    {filter === "my" ? (
      <>
        <h2 className="text-lg font-semibold text-gray-300">
          No blogs yet
        </h2>

        <p className="text-gray-400 text-sm mt-2">
          Start creating your first blog and share your ideas with the world.
        </p>
      </>
    ) : (
      <p className="text-gray-400 text-sm">
        No posts found.
      </p>
    )}

  </div>
)}


        {filteredPosts.map((post) => {
          const isOwner = user?.$id === post.userId;
          const isPrivate = post.status?.toLowerCase() === "private";

          return (
            <div
              key={post.$id}
              className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden relative
              group transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              {/* PRIVATE BADGE */}
              {isPrivate && isOwner && (
                <div className="absolute top-2 left-2 bg-red-500/90 text-white text-[10px] px-2 py-0.5 rounded z-20">
                  Private
                </div>
              )}

              <NavLink to={`/post/${post.$id}`} className="block">
                {post.featuredImage && (
                  <div className="overflow-hidden">
                    <img
                      src={storageServices.getFileView(post.featuredImage)}
                      alt=""
                      className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}

                <div className="p-3">
                  <h2 className="font-semibold line-clamp-1 group-hover:underline">
                    {post.title}
                  </h2>

                  <p className="text-xs text-gray-400">
                    {post.uploaderName} • {formatDate(post.$createdAt)}
                  </p>

                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {post.content
                      .replace(/<[^>]+>/g, "")
                      .slice(0, 80)}
                    ...
                  </p>

                  <div className="flex justify-between mt-2 text-xs items-center">
                    <span className="flex items-center gap-1">
                      <FaEye /> {post.views || 0}
                    </span>

                    {isOwner && filter === "my" && (
                      <div className="flex gap-3">
                        <NavLink
                          to={`/edit/${post.$id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-amber-400 hover:underline cursor-pointer"
                        >
                          Edit
                        </NavLink>

                      <button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal({ open: true, postId: post.$id });
  }}
  className="text-red-500 hover:underline cursor-pointer"
>
  Delete
</button>
                      </div>
                    )}
                  </div>
                </div>
              </NavLink>
            </div>
          );
        })}


      
      </div>
      {/* DELETE CONFIRM MODAL */}
{deleteModal.open && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
    
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[90%] max-w-sm shadow-xl transform transition-all animate-scaleIn">
      
      <h2 className="text-lg font-semibold mb-2">
        Delete Post?
      </h2>

      <p className="text-sm text-gray-400 mb-5">
        Are you sure you want to delete this post? This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        
        {/* Cancel */}
        <button
          onClick={() => setDeleteModal({ open: false, postId: null })}
          disabled={deleting}
          className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 cursor-pointer"
        >
          Cancel
        </button>

        {/* Confirm Delete */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer flex items-center gap-2"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>

      </div>
    </div>
  </div>
)}
{filter === "my" && (
  <div className="sticky bottom-0 left-0 w-full z-40 bg-black/80 backdrop-blur border-t border-gray-800 px-4 py-3 mt-6">
    
    <NavLink
      to="/write-blog"
      className="block w-full text-center bg-amber-400 text-black py-3 rounded-lg font-medium 
      hover:bg-amber-500 transition active:scale-95 cursor-pointer"
    >
      + Write Blog
    </NavLink>

  </div>
)}

    </div>
    
  );
}

export default Blogs;