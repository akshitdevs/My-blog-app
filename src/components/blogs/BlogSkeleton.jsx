// components/blogs/BlogSkeleton.jsx

import React from "react";

function BlogSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-gray-900/80 border border-gray-800/50 rounded-xl overflow-hidden animate-pulse"
                    style={{ animationDelay: `${i * 60}ms` }}
                >
                    {/* Image placeholder */}
                    <div className="w-full h-40 bg-gray-800/80" />

                    {/* Content placeholder */}
                    <div className="p-3 space-y-2">
                        <div className="h-4 bg-gray-800 rounded w-3/4" />
                        <div className="h-3 bg-gray-800 rounded w-1/2" />
                        <div className="h-3 bg-gray-800 rounded w-full" />
                        <div className="h-3 bg-gray-800 rounded w-5/6" />
                    </div>
                </div>
            ))}
        </>
    );
}

export default BlogSkeleton;