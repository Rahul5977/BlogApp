import auth from "./auth.js";
import config from "../config/config.js";
import { Client, Account, ID, Databases, Storage, Query } from "appwrite";

export class AppwriteService {
  client = new Client();
  databases;
  bucket;
  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          slug,
          content,
          featuredImage,
          status,
          userId,
        }
      );
    } catch (error) {}
  }
  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          slug,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.error("Error updating post:", error);
      throw new Error("Failed to update post");
    }
  }
  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug
      );
      return true; // Return true on successful deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      return false; // Return false if deletion fails
    }
  }
  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.error("Error fetching post:", error);
      throw new Error("Failed to fetch post");
    }
  }
  async getPosts() {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        [Query.equal("status", "active")],
        100, // Limit to 100 documents;
        0, // Offset
        ["title", "slug", "content", "featuredImage", "status", "userId"] // Attributes to retrieve
      );
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts");
    }
  }
  async uploadFile(file) {
    try {
      await this.bucket.createFile(config.appwriteBucketId, ID.unique(), file);
      return true; // Return true on successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
      return false; // Return false if upload fails
    }
  }
  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(config.appwriteBucketId, fileId);
      return true; // Return true on successful deletion
    } catch (error) {
      console.error("Error deleting file:", error);
      return false; // Return false if deletion fails}
    }
  }
  getFilePreviewUrl(fileId) {
    return this.bucket.getFilePreview(config.appwriteBucketId, fileId);
  }
  async downloadFile(fileId) {
    try {
      return this.bucket.getFileDownload(config.appwriteBucketId, fileId);
    } catch (error) {
      console.error("Error downloading file:", error);
      throw new Error("Failed to download file");
    }
  }
  async getFile(fileId) {
    try {
      return await this.bucket.getFile(config.appwriteBucketId, fileId);
    } catch (error) {
      console.error("Error fetching file:", error);
      throw new Error("Failed to fetch file");
    }
}
  async getFiles() {
    try {
      return await this.bucket.listFiles(config.appwriteBucketId, 100, 0);
    } catch (error) {
      console.error("Error fetching files:", error);
      throw new Error("Failed to fetch files");
    }
  }
  
}



export default new AppwriteService();
