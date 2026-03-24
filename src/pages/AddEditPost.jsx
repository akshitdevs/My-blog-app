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
  const { slug } = useParams(); // Document ID for edit
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", status: "active" });
  const [file, setFile] = useState(null);
  const [existingPost, setExistingPost] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Load current user safely
  useEffect(() => {
    authService.getCurrentUser()
      .then((u) => {
        if (!u) {
          alert("User not found! Please login again.");
          navigate("/login");
          return;
        }
        // fallback name from email if name missing
        if (!u.name) u.name = u.email?.split("@")[0] || "Unknown";
        setUser(u);
      })
      .catch((err) => console.log("Error fetching user:", err));
  }, []);

  // 🔹 Load existing post for editing
  useEffect(() => {
    if (!slug) return;
    databaseServices.getPost(slug)
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

  // 🔹 Handle create/update submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("User not loaded");

    setLoading(true);
    try {
      let finalFileId = existingPost?.featuredImage || null;

      // Upload new image if selected
      if (file) {
        const uploaded = await storageServices.uploadFile(file);
        if (!uploaded) throw new Error("File upload failed");
        finalFileId = uploaded.$id;
      }

      // Build payload according to Appwrite structure
      const postData = {
        userId: user.$id,
        uploaderName: user.name, // ✅ now correctly set
        title: form.title,
        content: form.content,
        status: form.status,
        featuredImage: finalFileId,
      };

      if (slug && existingPost) {
        // Update post
        await databaseServices.updatePost(slug, postData);
      } else {
        // Create new post
        await databaseServices.createPost(postData);
      }

      navigate("/blogs");
    } catch (err) {
      console.log("Submit error:", err);
      alert(err.message);
    }
    setLoading(false);
  };

  if (!user) return <div className="text-white p-10">Loading user...</div>;

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10 flex justify-center relative">
      {loading && <LoadingOverlay message={slug ? "Updating..." : "Publishing..."} />}

      <div className="w-full max-w-3xl flex flex-col gap-6 z-10">
        <h2 className="text-2xl font-semibold">{slug ? "Edit Blog" : "Create Blog"}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm"
          />

          <RTE
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
          />

          <select
            className="bg-black border border-gray-700 p-2 rounded"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <Button className="cursor-pointer" type="submit" disabled={loading}>
            {loading ? (slug ? "Updating..." : "Publishing...") : (slug ? "Update Blog" : "Publish Blog")}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddEditPost;