import { axiosInstance } from "../lib/axios-instance";

export class AnswerService {
  // Submit an Answer **************************
  async submitAnswer(answerDto) {
    try {
      const res = await axiosInstance.post("/api/answers/submit", answerDto);
      if (res.status === 201) {
        return res.data;
      } else {
        throw new Error(`Something went wrong on /answers/submit!`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Get Answers by Submission ID **************************
  async getAnswersBySubmission(submissionId) {
    if (!submissionId) {
      throw new Error(`Submission ID is required!`);
    }
    try {
      const res = await axiosInstance.get(
        `/api/answers/submissions/${submissionId}`
      );
      if (res.status === 200) {
        return res.data?.data;
      } else {
        throw new Error(
          `Something went wrong on /answers/submissions/:submissionId!`
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Grade an Answer **************************
  async gradeAnswer(answerId, gradeDto) {
    if (!answerId) {
      throw new Error(`Answer ID is required!`);
    }
    try {
      const res = await axiosInstance.post(
        `/api/answers/${answerId}`,
        gradeDto
      );
      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error(`Something went wrong on /answers/:id (grading)!`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Get Answer by ID **************************
  async getAnswerById(answerId) {
    if (!answerId) {
      throw new Error(`Answer ID is required!`);
    }
    try {
      const res = await axiosInstance.get(`/api/answers/${answerId}`);
      if (res.status === 200) {
        return res.data?.data;
      } else {
        throw new Error(`Something went wrong on /answers/:id!`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Delete Answer **************************
  async deleteAnswer(answerId) {
    if (!answerId) {
      throw new Error(`Answer ID is required!`);
    }
    try {
      const res = await axiosInstance.delete(`/api/answers/${answerId}`);
      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error(`Something went wrong on /answers/:id!`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const answerService = new AnswerService();
export default answerService;
