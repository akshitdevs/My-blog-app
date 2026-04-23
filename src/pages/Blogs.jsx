// pages/Blogs.jsx

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

// components
import BlogHeader from "../components/blogs/BlogHeader";
import BlogFilters from "../components/blogs/BlogFilters";
import BlogCard from "../components/blogs/BlogCard";
import DeleteModal from "../components/blogs/DeleteModal";
import BlogSkeleton from "../components/blogs/BlogSkeleton";

// hooks
import useBlogs from "../hooks/useBlogs";
import useSwipe from "../hooks/useSwipe";

const filters = ["latest", "today", "mostViewed", "my"];

function Blogs() {
  const user = useSelector((state) => state.auth.userData);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("latest");
  const [deleteModal, setDeleteModal] = useState({ open: false, postId: null });

  const {
    loading,
    deleting,
    handleDelete,
    debouncedSearch,
    filteredPosts,
  } = useBlogs(user, filter, search, deleteModal, setDeleteModal);

  const {
    dragX,
    isDragging,
    indicatorOffset,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useSwipe(filter, setFilter, filters);

  const indicatorIndex = filters.indexOf(filter) + indicatorOffset;

  return (
      <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="bg-black text-white min-h-screen flex flex-col"
      >
        <BlogHeader search={search} setSearch={setSearch} filter={filter} />

        <BlogFilters
            filter={filter}
            setFilter={setFilter}
            indicatorIndex={indicatorIndex}
            isDragging={isDragging}
            indicatorOffset={indicatorOffset}
        />

        {search !== debouncedSearch && (
            <div className="text-xs text-gray-600 mt-2 px-4 animate-pulse">
              Searching...
            </div>
        )}

        <div
            className="px-4 pt-4 pb-20"
            style={{
              transform: `translateX(${dragX}px)`,
              transition: isDragging
                  ? "none"
                  : "transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
        >
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3 pb-6">

            {loading && <BlogSkeleton />}

            {!loading && filteredPosts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center mt-20 text-center gap-2">
                  {filter === "my" ? (
                      <>
                        <h2 className="text-base font-medium text-gray-300">
                          No blogs yet
                        </h2>
                        <p className="text-gray-500 text-sm max-w-xs">
                          Start creating your first blog and share your ideas with the world.
                        </p>
                      </>
                  ) : debouncedSearch ? (
                      <p className="text-gray-500 text-sm">
                        No results for{" "}
                        <span className="text-amber-400">
                    "{debouncedSearch}"
                  </span>
                      </p>
                  ) : (
                      <p className="text-gray-500 text-sm">Nothing here yet.</p>
                  )}
                </div>
            )}

            {!loading &&
                filteredPosts.map((post, i) => (
                    <BlogCard
                        key={post.$id}
                        post={post}
                        index={i}
                        user={user}
                        filter={filter}
                        setDeleteModal={setDeleteModal}
                    />
                ))}
          </div>
        </div>

        <DeleteModal
            deleteModal={deleteModal}
            setDeleteModal={setDeleteModal}
            handleDelete={handleDelete}
            deleting={deleting}
        />

        {filter === "my" && (
            <div className="sticky bottom-0 z-40 w-full bg-black/90 backdrop-blur-md border-t border-gray-800/60 px-4 py-3">
              <NavLink
                  to="/write-blog"
                  className="flex items-center justify-center gap-2 w-full py-3
            bg-amber-400 text-black rounded-xl font-medium
            hover:bg-amber-300 transition-all active:scale-[0.98]"
              >
                <span className="text-3xl mb-1 leading-none">+</span>
                <span className="text-sm sm:text-base">Write Blog</span>
              </NavLink>
            </div>
        )}

        <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity:0; transform: scale(0.92) } to { opacity:1; transform: scale(1) } }
      `}</style>
      </div>
  );
}

export default Blogs;