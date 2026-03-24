import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import databaseServices from "../appwrite/config";
import storageServices from "../appwrite/storage";

function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    databaseServices.getPost(slug).then((data) => {
      setPost(data);
    });
  }, [slug]);

  if (!post) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10 max-w-3xl mx-auto">

      <h1 className="text-3xl font-semibold mb-6">
        {post.title}
      </h1>

      {post.featuredImage && (
        <img
          src={storageServices.getfileview(post.featuredImage)}
          alt={post.title}
          className="mb-6 rounded"
        />
      )}

      <div
        className="prose prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

    </div>
  );
}

export default PostPage;