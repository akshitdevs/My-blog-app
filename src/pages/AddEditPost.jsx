// pages/AddEditPost.jsx
import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import RTE from "../components/RTE";
import databaseServices from "../appwrite/config";
import storageServices from "../appwrite/storage";
import authService from "../appwrite/auth";
import { useNavigate, useParams } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";

// 🔥 IMPORT CENSOR
import { censorText, censorHTML } from "../utils/contentFilter";
import { containsBlockedWord } from "../utils/contentFilter";
function AddEditPost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    content: "",
    status: "public",
  });

  const [file, setFile] = useState(null);
  const [existingPost, setExistingPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animatePage, setAnimatePage] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "error",
  });

  // 🔥 MOBILE SWIPE STATES
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const showPopup = (message, type = "error") => {
    setPopup({ show: true, message, type });

    setTimeout(() => {
      setPopup({ show: false, message: "", type: "error" });
    }, 2200);
  };

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((u) => {
        if (!u) {
          navigate("/login");
          return;
        }

        if (!u.name) u.name = u.email?.split("@")[0] || "User";
        setUser(u);
      })
      .catch(() => showPopup("Failed to load user"))
      .finally(() => setAuthLoading(false));
  }, [navigate]);

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
            status: post.status || "public",
          });
        }
      })
      .catch(() => showPopup("Failed to load post"));
  }, [slug]);

  useEffect(() => {
    setTimeout(() => setAnimatePage(true), 50);
  }, []);

  // 🔥 MOBILE SWIPE HANDLERS
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const distance = touchStartX - touchEndX;

    if (distance > 80) {
      // Swipe Left - you can add future functionality
      console.log("Swiped Left");
    }

    if (distance < -80) {
      // Swipe Right - go back
      navigate(-1);
    }
  };

  // 🔥 SUBMIT HANDLER WITH CENSOR
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!form.title.trim()) {
      return showPopup("Title is required");
    }

    if (!form.content.trim()) {
      return showPopup("Content cannot be empty");
    }

    if (!file && !existingPost?.featuredImage) {
      return showPopup("You forgot to upload a cover image");
    }

    if (containsBlockedWord(form.title) || containsBlockedWord(form.content)) {
      showPopup("Your post contains inappropriate language");

      return; //
    }
    // //  CENSOR TEXT BEFORE SAVE
    const cleanTitle = censorText(form.title);
    const cleanContent = censorHTML(form.content);


    setLoading(true);

    try {
      let finalFileId = existingPost?.featuredImage || null;

      if (file) {
        const uploaded = await storageServices.uploadFile(file);
        if (!uploaded) throw new Error("Image upload failed");

        if (existingPost?.featuredImage) {
          await storageServices.deleteFile(existingPost.featuredImage);
        }

        finalFileId = uploaded.$id;
      }

      const postData = {
        userId: user.$id,
        uploaderName: user.name,
        title: cleanTitle,
        content: cleanContent,
        status: form.status,
        featuredImage: finalFileId,
        views: existingPost?.views || 0,
      };

      if (slug && existingPost) {
        await databaseServices.updatePost(slug, {
          ...postData,
          lastEditedAt: new Date().toISOString(),
        });

        showPopup("Post updated successfully", "success");
      } else {
        await databaseServices.createPost({
          ...postData,
          lastEditedAt: null,
        });

        showPopup("Post published successfully", "success");
      }

      setTimeout(() => navigate("/blogs"), 1000);
    } catch (err) {
      console.log(err);
      showPopup(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`bg-black text-white min-h-screen px-4 py-10 flex justify-center relative
      transition-all duration-700
      ${animatePage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div
            className={`px-6 py-3 rounded-lg shadow-xl text-white text-sm font-medium
            animate-popup
            ${popup.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {popup.message}
          </div>
        </div>
      )}

      {authLoading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          Checking user...
        </div>
      )}

      {loading && (
        <LoadingOverlay message={slug ? "Updating..." : "Publishing..."} />
      )}

      <div className="w-full max-w-3xl flex flex-col gap-6 z-10">
        <h2 className="text-2xl font-semibold">
          {slug ? "Edit Blog" : "Create Blog"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm border border-gray-600 rounded-lg p-2 cursor-pointer"
          />

          <RTE
            value={form.content}
            onChange={(value) =>
              setForm({ ...form, content: value })
            }
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="cursor-pointer bg-black border border-gray-700 p-2 rounded"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <Button
            type="submit"
            disabled={loading || !user}
            className="cursor-pointer"
          >
            {loading
              ? slug
                ? "Updating..."
                : "Publishing..."
              : slug
              ? "Update Blog"
              : "Publish Blog"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddEditPost;