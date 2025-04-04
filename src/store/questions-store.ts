import { create } from "zustand";
import questionService from "../services/question.service";

// Define initial state
const initialState = {
  questions: [],
};

const useQuestionStore = create((set) => ({
  // Initial states
  ...initialState,

  // Actions *****************************************

  // Fetch all submissions for an assignment
  fetchQuestionsBySubmission: async (assignmentId) => {
    try {
      const questions = await questionService.getQuestionsByAssignment(
        assignmentId
      );
      set({ questions });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useQuestionStore;
