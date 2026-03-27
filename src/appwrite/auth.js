import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf";
import { containsBlockedWord } from "../utils/contentFilter";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setProject(conf.appWriteProjectId)
      .setEndpoint(conf.appWriteUrl);

    this.account = new Account(this.client);
  }

  // ✅ CREATE ACCOUNT WITH VALIDATION MATCHING contentFilter
  async createAccount({ email, password, name }) {
    try {
      if (!name) {
        throw new Error("Username is required ❌");
      }

      // 🔴 BLOCK STRICT NAMES
      const blockedNamesStrict = ["akshit"];
      if (blockedNamesStrict.includes(name.toLowerCase())) {
        throw new Error("This username is not allowed ❌");
      }

      // 🚫 BLOCK BAD / RESTRICTED USERNAMES USING contentFilter
      if (containsBlockedWord(name)) {
        throw new Error(
          "Username contains restricted or inappropriate words ❌"
        );
      }

      // ✅ CREATE ACCOUNT
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      // ✅ AUTO LOGIN AFTER SIGNUP
      if (userAccount) {
        await this.login({ email, password });
      }

      return userAccount;
    } catch (error) {
      console.error("Signup Error:", error.message);
      throw error;
    }
  }

  // ✅ LOGIN
  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Login Error:", error.message);
      throw error;
    }
  }

  // ✅ GET CURRENT USER
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      return null;
    }
  }

  // ✅ LOGOUT
  async logout() {
    try {
      return await this.account.deleteSession("current");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  }
}

const authService = new AuthService();
export default authService;