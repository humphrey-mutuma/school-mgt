import { axiosInstance, axiosInstanceInsecure } from "../lib/axios-instance";
import { SessionUser } from "../store/user-store";

export class UserService {
  async registerUser(
    registerUserDto
  ): Promise<{ message: string; data: null }> {
    try {
      const res = await axiosInstanceInsecure.post(
        "/api/users/register",
        registerUserDto
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  // Login User (Non-Protected Route) **************************
  async loginUser(data): Promise<{ message: string; data: SessionUser }> {
    try {
      const res = await axiosInstanceInsecure.post("/api/users/login", data);
      return res.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Get All Users (Protected Route) **************************
  async getAllUsers() {
    try {
      const res = await axiosInstance.get("/api/users/");
      if (res.status === 200) {
        return res.data?.data;
      } else {
        throw new Error(`Something went wrong on /users!`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Get User Profile (Protected Route) **************************
  async getUserProfile() {
    try {
      const res = await axiosInstance.get(`/api/users/profile`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  // Delete User (Protected Route) **************************
  async deleteUser(userId) {
    if (!userId) {
      throw new Error(`Not Authorized!`);
    }
    try {
      const res = await axiosInstance.delete(`/api/users/${userId}`);
      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error(`Something went wrong on /users/:id!`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const userService = new UserService();
export default userService;
