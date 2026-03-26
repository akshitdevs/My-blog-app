// appwrite/config.js (DatabaseServices.js)
import { Client, Databases, ID, Permission, Role, Query } from "appwrite";
import conf from "../conf/conf";
import storageServices from "./storage";

export class DatabaseServices {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)
      .setProject(conf.appWriteProjectId);
    this.databases = new Databases(this.client);
  }

  // ✅ Create a new post
  async createPost({ userId, uploaderName, title, content, status, featuredImage, slug }) {
    return await this.databases.createDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      slug || ID.unique(),
      { userId, uploaderName, title, content, status, featuredImage, views: 0 },
      [
        Permission.read(Role.any()),          // anyone can read
        Permission.update(Role.user(userId)) // only owner can update
      ]
    );
  }

  // ✅ Update an existing post
  async updatePost(slug, data) {
    try {
      return await this.databases.updateDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug,
        data,
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(data.userId || data.user || null))
        ]
      );
    } catch (error) {
      console.log("updatePost error", error);
      throw error;
    }
  }

  // ✅ Get a post by slug
  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("getPost error", error);
      return null;
    }
  }

  // ✅ Get all posts
// appwrite/config.js
async getAllPost(queries = []) {
  try {
    return await this.databases.listDocuments(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      queries
    );
  } catch (error) {
    console.log("getAllPost error", error);
    return { documents: [] };
  }
}
  // ✅ Delete a post
  async deletePost(slug) {
    try {
      // 1️⃣ Get the post first
      const post = await this.getPost(slug);

      // 2️⃣ Delete featured image from storage if it exists
      if (post?.featuredImage) {
        try {
          await storageServices.deleteFile(post.featuredImage);
        } catch (err) {
          console.log("Failed to delete image:", err);
        }
      }

      // 3️⃣ Delete the post document
      await this.databases.deleteDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug
      );

      return true;
    } catch (error) {
      console.log("deletePost error", error);
      return false;
    }
  }

async incrementViews(postId, userId) {
  try {
    const post = await this.getPost(postId);
    if (!post) return;

    // Parse viewers JSON or initialize empty object
    let viewers = {};
    if (post.viewers) {
      try {
        viewers = JSON.parse(post.viewers);
      } catch (e) {
        viewers = {};
      }
    }

    const oneHourAgo = Date.now() - 1000 * 60 * 60;

    // Check if user has already viewed within last hour
    if (viewers[userId] && viewers[userId] > oneHourAgo) {
      return; // Already viewed recently → do nothing
    }

    // Update viewers map
    viewers[userId] = Date.now();

    // Increment views
    const updatedViews = (post.views || 0) + 1;

    await this.databases.updateDocument(
      conf.appWriteDatabaseId,
      conf.appWriteCollectionId,
      postId,
      { 
        views: updatedViews,
        viewers: JSON.stringify(viewers) // store as string
      },
      [Permission.update(Role.any())]
    );

  } catch (err) {
    console.log("incrementViews error", err);
  }
}

}

const databaseServices = new DatabaseServices();
export default databaseServices;