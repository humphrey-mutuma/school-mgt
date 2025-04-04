import { axiosInstance } from "../lib/axios-instance";

export class QuestionService {
  // Create a Question **************************
  async createQuestion(questionDto) {
    try {
      const res = await axiosInstance.post("/api/questions/", questionDto);
      if (res.status === 201) {
        return res.data;
      } else {
        throw new Error(`Something went wrong on /questions!`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Get All Questions for an Assignment **************************
  async getQuestionsByAssignment(assignmentId) {
    if (!assignmentId) {
      throw new Error(`Assignment ID is required!`);
    }
    try {
      const res = await axiosInstance.get(
        `/api/questions/assignment:${assignmentId}`
      );
      if (res.status === 200) {
        return res.data?.data;
      } else {
        throw new Error(
          `Something went wrong on /questions/assignment/:assignmentId!`
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Get Question by ID **************************
  async getQuestionById(questionId) {
    if (!questionId) {
      throw new Error(`Question ID is required!`);
    }
    try {
      const res = await axiosInstance.get(`/api/questions/${questionId}`);
      if (res.status === 200) {
        return res.data?.data;
      } else {
        throw new Error(`Something went wrong on /questions/:id!`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Update Question **************************
  async updateQuestion(questionId, updateQuestionDto) {
    if (!questionId) {
      throw new Error(`Question ID is required!`);
    }
    try {
      const res = await axiosInstance.patch(
        `/api/questions/${questionId}`,
        updateQuestionDto
      );
      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error(`Something went wrong on /questions/:id!`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Delete Question **************************
  async deleteQuestion(questionId) {
    if (!questionId) {
      throw new Error(`Question ID is required!`);
    }
    try {
      const res = await axiosInstance.delete(`/api/questions/${questionId}`);
      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error(`Something went wrong on /questions/:id!`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const questionService = new QuestionService();
export default questionService;
