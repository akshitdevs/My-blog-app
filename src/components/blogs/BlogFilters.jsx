// components/blogs/BlogFilters.jsx

import React from "react";

// same filters (kept consistent everywhere)
const filters = ["latest", "today", "mostViewed", "my"];

const FILTER_LABELS = {
    latest: "Latest",
    today: "Today",
    mostViewed: "Most Viewed",
    my: "My Blogs",
};

function BlogFilters({
                         filter,
                         setFilter,
                         indicatorIndex,
                         isDragging,
                         indicatorOffset,
                     }) {
    return (
        <div className="px-4 pt-2">
            <div className="relative">

                {/* 🔹 Tabs */}
                <div className="flex">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-1 py-2 text-xs font-medium transition-colors duration-200 cursor-pointer
              ${filter === f
                                ? "text-amber-400"
                                : "text-gray-500 hover:text-gray-300"
                            }`}
                        >
                            {FILTER_LABELS[f]}
                        </button>
                    ))}
                </div>

                {/* 🔹 Animated indicator */}
                <div className="relative h-0.5 bg-gray-800/60 rounded-full overflow-visible">
                    <div
                        className="absolute top-0 h-full bg-amber-400 rounded-full"
                        style={{
                            width: `${100 / filters.length}%`,
                            left: `${(indicatorIndex / filters.length) * 100}%`,

                            // smooth vs drag behavior
                            transition: isDragging
                                ? "none"
                                : "left 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1)",

                            // stretch effect while swiping
                            transform: isDragging
                                ? `scaleX(${1 + Math.abs(indicatorOffset) * 0.4})`
                                : "scaleX(1)",

                            transformOrigin:
                                indicatorOffset > 0 ? "left center" : "right center",
                        }}
                    />
                </div>

            </div>
        </div>
    );
}

export default BlogFilters;