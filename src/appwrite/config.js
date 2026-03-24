import { Client, Databases, ID, Role, Permission, Query } from "appwrite";
import conf from "../conf/conf";

export class DatabaseServices {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)
      .setProject(conf.appWriteProjectId);
    this.databases = new Databases(this.client);
  }

  // ✅ Create new post
  async createPost({ userId, uploaderName, title, content, status, featuredImage, slug }) {
  return await this.databases.createDocument(
    conf.appWriteDatabaseId,
    conf.appWriteCollectionId,
    slug || ID.unique(),
    {
      userId,
      uploaderName,
      title,
      content,
      status,
      featuredImage,
    },
    [
      Permission.read(Role.any()),
      Permission.update(Role.user(userId)),
    ]
  );
}

  // ✅ Update existing post
  async updatePost(slug, { userId, title, content, status, featuredImage }) {
    try {
      return await this.databases.updateDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug,
        { title, content, status, featuredImage },
        [
          Permission.read(Role.any()),          // anyone can read
          Permission.update(Role.user(userId)), // only owner can update
        ]
      );
    } catch (error) {
      console.log("updatePost error", error);
      throw error;
    }
  }

  async deletePost(slug) {
    try {
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

  async getAllPost(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("getAllPost error", error);
      return [];
    }
  }
}

const databaseServices = new DatabaseServices();
export default databaseServices;