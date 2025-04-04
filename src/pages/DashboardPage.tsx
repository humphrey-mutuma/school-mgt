import React, { useEffect } from "react";
import Dashboard from "../components/Dashboard";
import PagesLayout from "../layouts/PagesLayout";
import useUserStore from "../store/user-store";
import useAssignmentsStore from "../store/assignments-store ";

export default function DashboardPage() {
  const { userData, fetchProfileData } = useUserStore();
  const { fetchAssignments } = useAssignmentsStore();

  useEffect(() => {
    if (userData) {
      fetchProfileData();
    }
  }, [userData]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <PagesLayout>
      <Dashboard />
    </PagesLayout>
  );
}
