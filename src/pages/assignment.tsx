import React, { useEffect, useState } from "react";
import AssignmentForm from "../components/AssignmentForm";
import PagesLayout from "../layouts/PagesLayout";
import useUserStore from "../store/user-store";
import { useParams } from "react-router-dom";
import assignmentService from "../services/assignment.service";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import AssignmentAnswerForm from "../components/AssignmentAnswersForm";

export default function Assignment() {
  const { userData } = useUserStore();
  const [assignment, setAssignment] = useState(null);
  const { assignmentId } = useParams(); // Get dynamic param

  useEffect(() => {
    async function fetchAssignment() {
      const res = await assignmentService.getAssignmentById(assignmentId);
      if (res) {
        setAssignment(res);
      }
    }
    if (userData && assignmentId) {
      fetchAssignment();
    }
  }, [userData, assignmentId]);

  if (!userData) {
    return (
      <PagesLayout>
        <main className="container mx-auto py-10 text-center">
          <p>Please login to access this page</p>
        </main>
      </PagesLayout>
    );
  }

  console.log("assignment", assignment);

  return (
    <PagesLayout>
      <main className="container mx-auto py-6 ">
        {/* answers */}
        {assignment ? (
          <AssignmentAnswerForm {...{ assignment }} />
        ) : (
          <p>Loading ...</p>
        )}
      </main>
    </PagesLayout>
  );
}
