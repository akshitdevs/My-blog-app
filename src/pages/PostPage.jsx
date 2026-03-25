// pages/PostPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import databaseServices from "../appwrite/config";
import storageServices from "../appwrite/storage";
import authService from "../appwrite/auth";

function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Fetch logged-in user
    authService.getCurrentUser()
      .then((u) => setUser(u))
      .catch(() => setUser(null));
  }, []);

useEffect(() => {
  const fetchAndIncrement = async () => {
    try {
      const data = await databaseServices.getPost(slug);
      if (!data) return setLoading(false);

      setPost(data);
      setLoading(false);

      const viewerId = user?.$id || "guest";

      // ⚡ Fix here: call incrementViews instead of addPostView
      await databaseServices.incrementViews(slug, viewerId);

      // Refresh post to show updated views
      const updatedPost = await databaseServices.getPost(slug);
      setPost(updatedPost);

    } catch (err) {
      console.log("Error fetching post or updating views:", err);
    }
  };

  if (slug && user !== null) fetchAndIncrement();
}, [slug, user]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-gray-400 text-lg">
        Loading post...
      </div>
    );

  if (!post)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-gray-400 text-lg">
        Post not found.
      </div>
    );

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="bg-black text-white min-h-screen w-full px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 text-gray-400 text-sm sm:text-base gap-2 sm:gap-0">
          <p>
            By <span className="font-medium">{post.uploaderName || "Unknown"}</span> •{" "}
            {formatDate(post.$createdAt)}
            {post.$updatedAt !== post.$createdAt && (
              <> • Updated {formatDate(post.$updatedAt)}</>
            )}
          </p>
          <p>{post.views || 0} views</p>
        </div>

        {post.featuredImage && (
          <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
            <img
              src={storageServices.getFileView(post.featuredImage)}
              alt={post.title}
              className="w-full h-64 sm:h-96 object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}

        <article className="prose prose-invert max-w-full sm:prose-lg lg:prose-xl">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
    </div>
  );
}

export default PostPage;