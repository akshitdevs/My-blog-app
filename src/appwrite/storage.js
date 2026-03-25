// appwrite/storage.js
import { Client, ID, Storage, Permission, Role } from "appwrite";
import conf from "../conf/conf";

export class StorageServices {
  client = new Client();
  storage;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)        // Appwrite endpoint
      .setProject(conf.appWriteProjectId);  // Appwrite project ID

    this.storage = new Storage(this.client);
  }

  // ✅ Upload a file
  async uploadFile(file, fileId = ID.unique()) {
    try {
      if (!file) throw new Error("No file provided");

      const uploaded = await this.storage.createFile(
        conf.appWriteBucketId,  // bucket ID
        fileId,
        file,
        [
          Permission.read(Role.any()),   // anyone can read
          Permission.update(Role.any()), // allow updates
        ]
      );

      console.log("File uploaded:", uploaded.$id);
      return uploaded; // return uploaded file object
    } catch (error) {
      console.log("uploadFile error:", error);
      return null;
    }
  }

  // ✅ Delete a file
async deleteFile(fileId) {
  if (!fileId) {
    console.log("No fileId provided to delete.");
    return;
  }

  console.log("Deleting file with ID:", fileId); // 🔹 debug

  try {
    await this.storage.deleteFile(conf.appWriteBucketId, fileId);
    console.log("File deleted successfully!");
  } catch (err) {
    console.log("Failed to delete file:", err);
  }
}

  // ✅ Get a file view URL
  getFileView(fileId) {
    if (!fileId) return null;

    try {
      return this.storage.getFileView(conf.appWriteBucketId, fileId);
    } catch (error) {
      console.log("getFileView error:", error);
      return null;
    }
  }
}

// Export a singleton instance
const storageServices = new StorageServices();
export default storageServices;