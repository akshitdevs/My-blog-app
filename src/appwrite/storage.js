import { Client, ID, Storage } from "appwrite";
import conf from "../conf/conf";

export class StorageServices {
  client = new Client();
  storage;
  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)
      .setProject(conf.appWriteProjectId);
    this.storage = new Storage(this.client);
  }

  async uploadFile(file, fileId = ID.unique()) {
    try {
      const uploaded = await this.storage.createFile(
        conf.appWriteBucketId,
        fileId,
        file,
      );
      return uploaded; // ✅ Return the uploaded file object
    } catch (error) {
      console.log("uploadFile error", error);
      return null;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.storage.deleteFile(conf.appWriteBucketId, fileId);
    } catch (error) {
      console.log("deletFile error", error);
    }
  }

  getfileview(fileId) {
    return this.storage.getFileView(conf.appWriteBucketId, fileId);
  }
}

const storageServices = new StorageServices();

export default storageServices;
