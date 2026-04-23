// hooks/useBlogs.js

import { useEffect, useState } from "react";
import { Query } from "appwrite";

import databaseServices from "../appwrite/config";

function useBlogs(user, filter, search, deleteModal, setDeleteModal) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // 🔹 Debounce search (wait 300ms before applying)
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    // 🔹 Fetch posts
    useEffect(() => {
        if (!user && filter === "my") return;

        const fetchPosts = async () => {
            setLoading(true);
            setPosts([]);

            try {
                const res =
                    filter === "my"
                        ? await databaseServices.getAllPost([
                            Query.equal("userId", user.$id),
                        ])
                        : await databaseServices.getAllPost([
                            Query.equal("status", "public"),
                        ]);

                setPosts(res?.documents || []);
            } catch (err) {
                console.log("Fetch posts error:", err);
                setPosts([]);
            }

            setLoading(false);
        };

        fetchPosts();
    }, [filter, user]);

    // 🔹 Delete post
    const handleDelete = async () => {
        if (!deleteModal.postId) return;

        setDeleting(true);

        try {
            await databaseServices.deletePost(deleteModal.postId);

            setPosts((prev) =>
                prev.filter((p) => p.$id !== deleteModal.postId)
            );

            setDeleteModal({ open: false, postId: null });
        } catch (err) {
            console.log("Delete error:", err);
        }

        setDeleting(false);
    };

    // 🔹 Filter + search logic
    const filteredPosts = posts
        .filter((post) => {
            const isOwner = post.userId === user?.$id;

            // hide private posts from others
            if (!isOwner && post.status?.toLowerCase() === "private") return false;

            // today filter
            if (filter === "today") {
                const isToday =
                    new Date(post.$createdAt).toDateString() ===
                    new Date().toDateString();

                if (!isToday) return false;
            }

            // search filter
            if (debouncedSearch.trim()) {
                const s = debouncedSearch.toLowerCase();

                const match =
                    post.title?.toLowerCase().includes(s) ||
                    post.content
                        ?.replace(/<[^>]+>/g, "")
                        .toLowerCase()
                        .includes(s) ||
                    post.uploaderName?.toLowerCase().includes(s);

                if (!match) return false;
            }

            return true;
        })
        .sort((a, b) => {
            if (filter === "latest") {
                return new Date(b.$createdAt) - new Date(a.$createdAt);
            }

            if (filter === "mostViewed") {
                return (b.views || 0) - (a.views || 0);
            }

            return 0;
        });

    return {
        posts,
        loading,
        deleting,
        handleDelete,
        debouncedSearch,
        filteredPosts,
    };
}

export default useBlogs;