import React from "react";
import AssignmentForm from "../components/AssignmentForm";
import PagesLayout from "../layouts/PagesLayout";
import useUserStore from "../store/user-store";

export default function Assignments() {
  const { userData } = useUserStore();
  if (!userData) {
    return (
      <PagesLayout>
        <main className="container mx-auto py-10 text-center">
          <p>Please login to access this page</p>
        </main>
      </PagesLayout>
    );
  }
  if (userData.role !== "LECTURER") {
    return (
      <PagesLayout>
        <main className="container mx-auto py-10 text-center">
          <p>Not authorized access this page</p>
        </main>
      </PagesLayout>
    );
  }
  return (
    <PagesLayout>
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Create Assignment</h1>
        <AssignmentForm />
      </main>
    </PagesLayout>
  );
}
