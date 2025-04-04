import { create } from "zustand";
import answerService from "../services/answer.service";

// Define initial state
const initialState = {
  answers: [],
};

const useAnswersStore = create((set) => ({
  // Initial states
  ...initialState,

  // Actions *****************************************

  // Fetch all submissions for an assignment
  fetchAnswersBySubmission: async (assignmentId) => {
    try {
      const submissions = await answerService.getAnswersBySubmission(
        assignmentId
      );
      set({ submissions });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useAnswersStore;
