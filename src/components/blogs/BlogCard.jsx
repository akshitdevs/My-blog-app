// components/blogs/BlogCard.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import parse from "html-react-parser";

import storageServices from "../../appwrite/storage";

function BlogCard({ post, index, user, filter, setDeleteModal }) {
    const isOwner = user?.$id === post.userId;
    const isPrivate = post.status?.toLowerCase() === "private";

    // 🔹 format date (same logic as before)
    const formatDate = (created, lastEdited) => {
        const fmt = (d) =>
            new Date(d).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });

        return lastEdited
            ? `${fmt(created)} • Updated: ${fmt(lastEdited)}`
            : fmt(created);
    };

    return (
        <div
            className="bg-gray-900 border border-gray-800/60 rounded-xl overflow-hidden relative
      group transition-all duration-300 ease-out hover:scale-[1.02] hover:border-gray-700
      hover:shadow-2xl hover:shadow-black/40 cursor-pointer"
            style={{
                animationDelay: `${index * 40}ms`,
            }}
        >
            {/* 🔹 Private badge */}
            {isPrivate && isOwner && (
                <div className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm text-white
        text-[10px] px-2 py-0.5 rounded-full z-20 font-medium tracking-wide">
                    Private
                </div>
            )}

            <NavLink to={`/post/${post.$id}`} className="block">

                {/* 🔹 Image */}
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

                {/* 🔹 Content */}
                <div className="p-3">
                    <h2 className="font-semibold line-clamp-1 text-sm group-hover:text-amber-400 transition-colors duration-200">
                        {post.title}
                    </h2>

                    <p className="text-xs text-gray-500 mt-0.5">
                        {post.uploaderName} • {formatDate(post.$createdAt, post.lastEditedAt)}
                    </p>

                    <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {parse(post.content)}…
                    </p>

                    {/* 🔹 Bottom row */}
                    <div className="flex justify-between mt-2.5 items-center">
            <span className="flex items-center gap-1 text-xs text-gray-600">
              <FaEye size={10} /> {post.views || 0}
            </span>

                        {/* 🔹 Owner actions */}
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
}

export default BlogCard;