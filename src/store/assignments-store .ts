import { create } from "zustand";
import assignmentService from "../services/assignment.service";

// Define types
interface AssignmentsStore {
  assignments: []; // Replace `any[]` with a proper type for your assignments
  fetchAssignments: () => Promise<void>;
}

const useAssignmentsStore = create<AssignmentsStore>((set) => ({
  // State
  assignments: [],

  // Action to fetch assignments
  fetchAssignments: async () => {
    try {
      const response = await assignmentService.getAllAssignments();
      set({ assignments: response }); // Ensure response.data contains the expected structure
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  },
}));

export default useAssignmentsStore;
