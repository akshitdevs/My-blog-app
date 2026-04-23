// components/blogs/BlogHeader.jsx

import React from "react";

function BlogHeader({ search, setSearch, filter }) {
    return (
        <div className="shrink-0 bg-black/95 backdrop-blur-md border-b border-gray-800/60 px-4 py-3 flex flex-col gap-3">

            {/* 🔹 Title + subtitle */}
            <div>
                <h1 className="text-xl font-semibold tracking-tight">Blogs</h1>

                {/* show hint only when NOT on "my" */}
                {filter !== "my" && (
                    <p className="text-gray-500 text-xs mt-0.5">
                        Switch to{" "}
                        <span className="text-amber-400 font-medium">My Blogs</span>{" "}
                        to manage your posts.
                    </p>
                )}
            </div>

            {/* 🔹 Search input */}
            <div className="flex w-full md:w-1/2">
                <input
                    type="text"
                    placeholder="Search blogs, users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-l-lg outline-none
          border border-gray-800 border-r-0 focus:border-amber-400/50 transition-colors"
                />

                {/* clear button */}
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
        </div>
    );
}

export default BlogHeader;