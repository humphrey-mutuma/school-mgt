import React, { useEffect, useState } from "react";
import AssignmentForm from "../components/AssignmentForm";
import PagesLayout from "../layouts/PagesLayout";
import useUserStore from "../store/user-store";
import { useParams } from "react-router-dom";
import assignmentService from "../services/assignment.service";
import submissionService from "../services/submission.service";
import AssignmentGradingTable from "../components/GradingForm";

export default function Mark() {
  const { userData } = useUserStore();
  const [submissions, setSubmissions] = useState(null);
  const { assignmentId } = useParams(); // Get dynamic param

  useEffect(() => {
    async function fetchSubmissions() {
      const res = await submissionService.getSubmissionsByAssignment(
        assignmentId
      );
      if (res) {
        setSubmissions(res);
      }
    }
    if (userData && assignmentId) {
      fetchSubmissions();
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

  if (userData?.role !== "LECTURER") {
    return (
      <PagesLayout>
        <main className="container mx-auto py-10 text-center">
          <p>Not Authorized to access this page!</p>
        </main>
      </PagesLayout>
    );
  }

  console.log("submissions", submissions);

  return (
    <PagesLayout>
      <main className="container mx-auto py-6 ">
        {/* answers */}
        {submissions ? (
          <AssignmentGradingTable {...{ submissions }} />
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </PagesLayout>
  );
}
