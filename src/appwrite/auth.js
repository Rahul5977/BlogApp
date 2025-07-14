import config from "../config/config.js";
import { Client, Account, ID } from "appwrite";
class AuthService {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.account = new Account(this.client);
  }
  //sari services bnaunga mai appwrite ka
  //frontend ko pta ni hai ki bakend me appwrite hai
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (!userAccount) {
        throw new Error("Account creation failed");
      }
      return this.login({ email, password });
    } catch (error) {
      throw error;
    }
  }
  async login({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      if (!session) {
        throw new Error("Login failed");
      }
      return session;
    } catch (error) {
      throw error;
    }
  }
  async logout() {
    try {
      await this.account.deleteSessions();
      return true;
    } catch (error) {
      throw error;
    }
  }
  async getCurrentUser() {
    try {
      const user = await this.account.get();
      return user;
    } catch (error) {
      console.log("Error fetching current user:", error);
    }
    return null; // Return null
  }
}
export default new AuthService();
