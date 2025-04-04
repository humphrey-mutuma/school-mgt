import { axiosInstance } from "../lib/axios-instance";

export class AssignmentService {
  // Create an Assignment **************************
  async createAssignment(assignmentDto) {
    try {
      const res = await axiosInstance.post("/api/assignments", assignmentDto);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  // Get All Assignments **************************
  async getAllAssignments() {
    try {
      const res = await axiosInstance.get("/api/assignments");
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  // Get Assignment by ID **************************
  async getAssignmentById(assignmentId) {
    if (!assignmentId) {
      throw new Error(`Assignment ID is required!`);
    }
    try {
      const res = await axiosInstance.get(`/api/assignments/${assignmentId}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  // Update Assignment **************************
  async updateAssignment(assignmentId, updateAssignmentDto) {
    if (!assignmentId) {
      throw new Error(`Assignment ID is required!`);
    }
    try {
      const res = await axiosInstance.patch(
        `/api/assignments/${assignmentId}`,
        updateAssignmentDto
      );
      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error(`Something went wrong on /assignments/:id!`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Delete Assignment **************************
  async deleteAssignment(assignmentId) {
    if (!assignmentId) {
      throw new Error(`Assignment ID is required!`);
    }
    try {
      const res = await axiosInstance.delete(
        `/api/assignments/${assignmentId}`
      );
      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error(`Something went wrong on /assignments/:id!`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const assignmentService = new AssignmentService();
export default assignmentService;
