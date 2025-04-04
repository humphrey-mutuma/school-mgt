import { axiosInstance } from "../lib/axios-instance";

export class SubmissionService {
  // Submit Assignment **************************
  async submitAssignment(submissionDto) {
    try {
      const res = await axiosInstance.post("/api/submissions", {
        answers: submissionDto,
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  // Grade Submission **************************
  async gradeSubmission(gradeDto) {
    try {
      const res = await axiosInstance.patch("/api/submissions/grade", gradeDto);
      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error(`Something went wrong on /submissions!`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Get All Submissions for an Assignment **************************
  async getSubmissionsByAssignment(assignmentId) {
    if (!assignmentId) {
      throw new Error(`Assignment ID is required!`);
    }
    try {
      const res = await axiosInstance.get(
        `/api/submissions/submission/${assignmentId}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  // Get Submission by ID **************************
  async getSubmissionById(submissionId) {
    if (!submissionId) {
      throw new Error(`Submission ID is required!`);
    }
    try {
      const res = await axiosInstance.get(`/api/submissions/${submissionId}`);
      if (res.status === 200) {
        return res.data?.data;
      } else {
        throw new Error(`Something went wrong on /submissions/:id!`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Delete Submission **************************
  async deleteSubmission(submissionId) {
    if (!submissionId) {
      throw new Error(`Submission ID is required!`);
    }
    try {
      const res = await axiosInstance.delete(
        `/api/submissions/${submissionId}`
      );
      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error(`Something went wrong on /submissions/:id!`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const submissionService = new SubmissionService();
export default submissionService;
