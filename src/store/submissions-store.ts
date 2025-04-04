import { create } from "zustand";
import submissionService from "../services/submission.service";

// Define initial state
const initialState = {
  submissions: [],
};

const useSubmissionStore = create((set) => ({
  // Initial states
  ...initialState,

  // Actions *****************************************

  // Fetch all submissions for an assignment
  fetchSubmissionsByAssignment: async (assignmentId) => {
    try {
      const submissions = await submissionService.getSubmissionsByAssignment(
        assignmentId
      );
      set({ submissions });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useSubmissionStore;
