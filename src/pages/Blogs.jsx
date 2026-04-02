// pages/Blogs.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Query } from "appwrite";
import databaseServices from "../appwrite/config";
import storageServices from "../appwrite/storage";
import { FaEye } from "react-icons/fa";

const filters = ["latest", "today", "mostViewed", "my"];
const FILTER_LABELS = {
  latest: "Latest",
  today: "Today",
  mostViewed: "Most Viewed",
  my: "My Blogs",
};
const SWIPE_THRESHOLD = 60;   // px to commit a swipe
const VELOCITY_THRESHOLD = 0.3; // px/ms to commit on flick

function Blogs() {
  const [deleteModal, setDeleteModal] = useState({ open: false, postId: null });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleting, setDeleting] = useState(false);
  const user = useSelector((state) => state.auth.userData);

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("latest");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ─── Swipe state ───────────────────────────────────────────
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [indicatorOffset, setIndicatorOffset] = useState(0); // 0–1 fraction toward next/prev
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isSwiping = useRef(false);
  const lastVelX = useRef(0); // px/ms velocity

  // ─── Search debounce ───────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // ─── Fetch posts ───────────────────────────────────────────
  useEffect(() => {
    if (!user && filter === "my") return;
    const fetchPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = filter === "my"
          ? await databaseServices.getAllPost([Query.equal("userId", user.$id)])
          : await databaseServices.getAllPost([Query.equal("status", "public")]);
        setPosts(res?.documents || []);
      } catch (err) {
        console.log("Fetch posts error:", err);
        setPosts([]);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [filter, user]);

  // ─── Filter change (with direction-aware slide) ────────────
  const handleFilter = useCallback((f) => {
    if (f === filter) return;
    setFilter(f);
  }, [filter]);

  // ─── Touch handlers ────────────────────────────────────────
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    isSwiping.current = false;
    lastVelX.current = 0;
    setIsDragging(true);
    setDragX(0);
    setIndicatorOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    const dt = Date.now() - touchStartTime.current;

    // Direction lock
    if (!isSwiping.current) {
      if (Math.abs(dx) < 6) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        isSwiping.current = true;
      } else {
        setIsDragging(false);
        return;
      }
    }

    if (isSwiping.current) e.preventDefault();

    // Velocity (px/ms)
    lastVelX.current = dt > 0 ? dx / dt : 0;

    const currentIndex = filters.indexOf(filter);
    const atStart = currentIndex === 0 && dx > 0;
    const atEnd = currentIndex === filters.length - 1 && dx < 0;

    // Edge rubber-band resistance
    const moveX = (atStart || atEnd) ? dx * 0.25 : dx;

    // Drive indicator toward next/prev pill
    const progress = Math.max(-1, Math.min(1, -dx / window.innerWidth));
    setDragX(moveX);
    setIndicatorOffset(progress);
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) {
      setDragX(0);
      setIndicatorOffset(0);
      setIsDragging(false);
      return;
    }

    const currentIndex = filters.indexOf(filter);
    const momentumBoost = lastVelX.current * 150; // project forward
    const effective = dragX + momentumBoost;

    if (effective < -SWIPE_THRESHOLD && currentIndex < filters.length - 1) {
      handleFilter(filters[currentIndex + 1]);
    } else if (effective > SWIPE_THRESHOLD && currentIndex > 0) {
      handleFilter(filters[currentIndex - 1]);
    }

    setDragX(0);
    setIndicatorOffset(0);
    setIsDragging(false);
  };

  // ─── Date format ───────────────────────────────────────────
  const formatDate = (created, lastEdited) => {
    const fmt = (d) => new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
    return lastEdited
      ? `${fmt(created)} • Updated: ${fmt(lastEdited)}`
      : fmt(created);
  };

  // ─── Delete ────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteModal.postId) return;
    setDeleting(true);
    try {
      await databaseServices.deletePost(deleteModal.postId);
      setPosts((prev) => prev.filter((p) => p.$id !== deleteModal.postId));
      setDeleteModal({ open: false, postId: null });
    } catch (err) {
      console.log("Delete error:", err);
    }
    setDeleting(false);
  };

  // ─── Filter logic ──────────────────────────────────────────
  const filteredPosts = posts
    .filter((post) => {
      const isOwner = post.userId === user?.$id;
      if (!isOwner && post.status?.toLowerCase() === "private") return false;
      if (filter === "today") {
        const isToday = new Date(post.$createdAt).toDateString() === new Date().toDateString();
        if (!isToday) return false;
      }
      if (debouncedSearch.trim()) {
        const s = debouncedSearch.toLowerCase();
        const match =
          post.title?.toLowerCase().includes(s) ||
          post.content?.replace(/<[^>]+>/g, "").toLowerCase().includes(s) ||
          post.uploaderName?.toLowerCase().includes(s);
        if (!match) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filter === "latest") return new Date(b.$createdAt) - new Date(a.$createdAt);
      if (filter === "mostViewed") return (b.views || 0) - (a.views || 0);
      return 0;
    });

  // ─── Indicator lerp position ───────────────────────────────
  // indicatorOffset drives the pill toward the next/prev tab while dragging
  const currentIndex = filters.indexOf(filter);
  const indicatorIndex = currentIndex + indicatorOffset;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="bg-black text-white min-h-screen flex flex-col "
    // className="bg-black text-white h-screen flex flex-col border-2 border-red-600 overflow-hidden"
    >
      {/* ── HEADER ── */}
      <div className="shrink-0 bg-black/95 backdrop-blur-md border-b border-gray-800/60 px-4 py-3 flex flex-col gap-3">


        <div>
          <h1 className="text-xl font-semibold tracking-tight">Blogs</h1>
          {filter !== "my" && (
            <p className="text-gray-500 text-xs mt-0.5">
              Switch to{" "}
              <span className="text-amber-400 font-medium">My Blogs</span>{" "}
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
            className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-l-lg outline-none
              border border-gray-800 border-r-0 focus:border-amber-400/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="bg-amber-400 text-black px-3 rounded-r-lg font-medium
                active:scale-95 transition-transform"
            >
              ✕
            </button>
          )}
        </div>

        {/* FILTER TABS — Instagram-style pill indicator */}
        <div className="relative">
          <div className="flex">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                className={`flex-1 py-2 text-xs font-medium transition-colors duration-200 cursor-pointer
                  ${filter === f ? "text-amber-400" : "text-gray-500 hover:text-gray-300"}`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>

          {/* Animated indicator bar */}
          <div className="relative h-0.5 bg-gray-800/60 rounded-full overflow-visible">
            <div
              className="absolute top-0 h-full bg-amber-400 rounded-full"
              style={{
                width: `${100 / filters.length}%`,
                left: `${(indicatorIndex / filters.length) * 100}%`,
                transition: isDragging
                  ? "none"
                  : "left 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1)",
                // Stretch pill slightly mid-swipe for a satisfying elastic feel
                transform: isDragging
                  ? `scaleX(${1 + Math.abs(indicatorOffset) * 0.4})`
                  : "scaleX(1)",
                transformOrigin: indicatorOffset > 0 ? "left center" : "right center",
              }}
            />
          </div>
        </div>
      </div>

      {search !== debouncedSearch && (
        <div className="text-xs text-gray-600 mt-2 px-4 animate-pulse">Searching...</div>
      )}

      {/* ── POSTS GRID ── */}
      <div

        className="px-4 pt-4 pb-20"
        // className="flex-1 overflow-y-auto px-4 pt-4"
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? "none" : "transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)",
          willChange: "transform",
        }}
      >
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 pb-6">

          {/* Skeleton loaders */}
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-900/80 border border-gray-800/50 rounded-xl overflow-hidden animate-pulse"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-full h-40 bg-gray-800/80" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
                <div className="h-3 bg-gray-800 rounded w-full" />
                <div className="h-3 bg-gray-800 rounded w-5/6" />
              </div>
            </div>
          ))}

          {/* Empty state */}
          {!loading && filteredPosts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center mt-20 text-center gap-2">
              {filter === "my" ? (
                <>
                  <h2 className="text-base font-medium text-gray-300">No blogs yet</h2>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Start creating your first blog and share your ideas with the world.
                  </p>
                </>
              ) : debouncedSearch ? (
                <p className="text-gray-500 text-sm">
                  No results for{" "}
                  <span className="text-amber-400">"{debouncedSearch}"</span>
                </p>
              ) : (
                <p className="text-gray-500 text-sm">Nothing here yet.</p>
              )}
            </div>
          )}

          {/* Post cards */}
          {!loading && filteredPosts.map((post, i) => {
            const isOwner = user?.$id === post.userId;
            const isPrivate = post.status?.toLowerCase() === "private";

            return (
              <div
                key={post.$id}
                className="bg-gray-900 border border-gray-800/60  rounded-xl  overflow-hidden relative
                  group transition-all duration-300 ease-out hover:scale-[1.02] hover:border-gray-700
                  hover:shadow-2xl hover:shadow-black/40 cursor-pointer"
                style={{
                  // Staggered entrance on filter change
                  animationDelay: `${i * 40}ms`,
                }}
              >
                {isPrivate && isOwner && (
                  <div className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm text-white
                    text-[10px] px-2 py-0.5 rounded-full z-20 font-medium tracking-wide">
                    Private
                  </div>
                )}

                <NavLink to={`/post/${post.$id}`} className="block">
                  {post.featuredImage && (
                    <div className="overflow-hidden">
                      <img
                        src={storageServices.getFileView(post.featuredImage)}
                        alt=""
                        loading="lazy"
                        className="w-full h-40 object-cover transition-transform duration-700
                          group-hover:scale-110 group-hover:brightness-110"
                      />
                    </div>
                  )}

                  <div className="p-3">
                    <h2 className="font-semibold line-clamp-1 text-sm group-hover:text-amber-400
                      transition-colors duration-200">
                      {post.title}
                    </h2>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {post.uploaderName} • {formatDate(post.$createdAt, post.lastEditedAt)}
                    </p>

                    <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {post.content.replace(/<[^>]+>/g, "").slice(0, 100)}…
                    </p>

                    <div className="flex justify-between mt-2.5 items-center">
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <FaEye size={10} /> {post.views || 0}
                      </span>

                      {isOwner && filter === "my" && (
                        <div className="flex gap-3">
                          <NavLink
                            to={`/edit/${post.$id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            Edit
                          </NavLink>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeleteModal({ open: true, postId: post.$id });
                            }}
                            className="text-xs text-red-500 hover:text-red-400 transition-colors cursor-pointer"
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
      </div>

      {/* ── DELETE MODAL ── */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center
          justify-center z-50"
          style={{ animation: "fadeIn 0.2s ease" }}
        >
          <div className="bg-gray-900 border border-gray-700/60 rounded-2xl p-6 w-[88%] max-w-sm shadow-2xl"
            style={{ animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <h2 className="text-base font-semibold mb-1">Delete post?</h2>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModal({ open: false, postId: null })}
                disabled={deleting}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm
                  hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
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
      )}


      {/* ── WRITE BUTTON ── */}
      {filter === "my" && (
        <div
          className="sticky bottom-0 z-40 w-full bg-black/90 backdrop-blur-md border-t border-gray-800/60 px-4 py-3"
        // className=" sticky shrink-0 bg-black/90 backdrop-blur-md bottom-0 w-full border-t border-gray-800/60 px-4 py-3"

        >
          <NavLink
            to="/write-blog"
            className="flex items-center justify-center gap-2 w-full py-3 
  bg-amber-400 text-black rounded-xl font-medium
  hover:bg-amber-300 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span className="text-3xl mb-1 leading-none">+</span>
            <span className="text-sm sm:text-base">Write Blog</span>
          </NavLink>
        </div>
      )}

      {/* ── GLOBAL ANIMATIONS ── */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity:0; transform: scale(0.92) } to { opacity:1; transform: scale(1) } }
      `}</style>
    </div>
  );
}

export default Blogs;