// pages/AddEditPost.jsx
import React, { useState, useEffect } from "react";
import Input from "../componants/Input";
import Button from "../componants/Button";
import RTE from "../componants/RTE";
import databaseServices from "../appwrite/config";
import storageServices from "../appwrite/storage";
import authService from "../appwrite/auth";
import { useNavigate, useParams } from "react-router-dom";
import LoadingOverlay from "../componants/LoadingOverlay";

function AddEditPost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    content: "",
    status: "active",
  });
  const [file, setFile] = useState(null);
  const [existingPost, setExistingPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animatePage, setAnimatePage] = useState(false);

  // 🔹 Load current user
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((u) => {
        if (!u) {
          navigate("/login");
          return;
        }

        if (!u.name) u.name = u.email?.split("@")[0] || "Unknown";

        setUser(u);
      })
      .catch((err) => console.log("Error fetching user:", err))
      .finally(() => setAuthLoading(false));
  }, [navigate]);

  // 🔹 Load existing post (edit mode)
  useEffect(() => {
    if (!slug) return;

    databaseServices
      .getPost(slug)
      .then((post) => {
        if (post) {
          setExistingPost(post);
          setForm({
            title: post.title || "",
            content: post.content || "",
            status: post.status || "active",
          });
        }
      })
      .catch((err) => console.log("Error fetching post:", err));
  }, [slug]);

  // 🔹 Animate page on mount
  useEffect(() => {
    setTimeout(() => setAnimatePage(true), 50);
  }, []);

  // 🔹 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let finalFileId = existingPost?.featuredImage || null;

      if (file) {
        const uploaded = await storageServices.uploadFile(file);
        if (!uploaded) throw new Error("File upload failed");

        if (existingPost?.featuredImage) {
          await storageServices.deleteFile(existingPost.featuredImage);
        }

        finalFileId = uploaded.$id;
      }

      const postData = {
        userId: user.$id,
        uploaderName: user.name,
        title: form.title,
        content: form.content,
        status: form.status,
        featuredImage: finalFileId,
        views: existingPost?.views || 0,
      };

      if (slug && existingPost) {
        await databaseServices.updatePost(slug, postData);
      } else {
        await databaseServices.createPost(postData);
      }

      navigate("/blogs");
    } catch (err) {
      console.log("Submit error:", err);
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div
      className={`bg-black text-white min-h-screen px-4 py-10 flex justify-center relative
      transition-all duration-700 ease-in-out
      ${animatePage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      {/* 🔹 Overlay while checking user */}
      {authLoading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="text-white text-lg animate-pulse">
            Checking user...
          </div>
        </div>
      )}

      {/* 🔹 Loading overlay for submit */}
      {loading && <LoadingOverlay message={slug ? "Updating..." : "Publishing..."} />}

      {/* 🔹 Form container */}
      <div
        className={`w-full max-w-3xl flex flex-col gap-6 z-10
        transition-all duration-500 ease-in-out
        ${authLoading ? "opacity-50" : "opacity-100"}`}
      >
        <h2 className="text-2xl font-semibold">
          {slug ? "Edit Blog" : "Create Blog"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="
              block w-full text-sm text-gray-600
              border border-gray-300 rounded-lg
              hover:border-blue-400
              focus:outline-none focus:border-blue-500
              transition-all duration-200
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer
            "
          />

          {/* RTE editor */}
          <RTE
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
          />

          {/* Status */}
          <select
            className="bg-black border border-gray-700 p-2 rounded hover:border-blue-400 transition-all"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Submit button */}
          <Button
            className="cursor-pointer"
            type="submit"
            disabled={loading || !user}
          >
            {loading ? (slug ? "Updating..." : "Publishing...") : slug ? "Update Blog" : "Publish Blog"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddEditPost;