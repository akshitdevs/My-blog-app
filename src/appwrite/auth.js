import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setProject(conf.appWriteProjectId)
      .setEndpoint(conf.appWriteUrl);
    this.account = new Account(this.client);
  }

async createAccount({ email, password, name }) {
  try {
    const userAccount = await this.account.create(
      ID.unique(),
      email,
      password,
      name
    );

    if (userAccount) {
      // ✅ AUTO LOGIN AFTER SIGNUP
      await this.login({ email, password });
    }

    return userAccount;
  } catch (error) {
    throw error;
  }
}

async login({ email, password }) {
  try {
    return await this.account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw error;
  }
}

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      return null;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSession("current");
    } catch (error) {
      console.log(error, "logout error");
    }
  }
}

const authService = new AuthService();
export default authService;
