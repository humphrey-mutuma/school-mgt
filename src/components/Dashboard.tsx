"use client";

import { useState } from "react";
import { Search, Book, Calendar, Clock, CheckCircle } from "lucide-react";
import useUserStore from "../store/user-store";
import { Link } from "react-router-dom";
import useAssignmentsStore from "../store/assignments-store ";
import { format } from "date-fns";
import { Button } from "./ui/button";

const Dashboard = () => {
  const { userData, profileData } = useUserStore();
  const { assignments } = useAssignmentsStore();

  const [searchTerm, setSearchTerm] = useState("");

  // Filter assignments based on search term
  const filteredAssignments = assignments?.filter(
    (assignment: any) =>
      assignment?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment?.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if assignment is currently active
  const isAssignmentActive = (assignment) => {
    const now = new Date();
    const startDate = new Date(assignment.startDate);
    const endDate = new Date(assignment.endDate);
    return now >= startDate && now <= endDate;
  };
  const isAssignmentOverDue = (assignment) => {
    const now = new Date();
    const endDate = new Date(assignment.endDate);
    return now > endDate;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Stats cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2   mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <Book className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Assignments Published
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {assignments?.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            {userData?.role == "LECTURER" ? (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <Link to="/assignments">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>Create new Assignment {"->"}</dl>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-500 rounded-md p-3">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Submissions
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {profileData?.submissions?.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Assignment list */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {/* search bar */}
            <div className="relative p-3 ">
              <div className="absolute ml-2 inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>{" "}
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Assignments
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                A list of all published assignments
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {filteredAssignments.length > 0 ? (
                filteredAssignments?.map((assignment: any) => {
                  const submission = profileData?.submissions.find(
                    (submission) =>
                      submission.assignmentId._id === assignment._id
                  );
                  return (
                    <li key={assignment?._id}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex justify-between ">
                        <div className="flex flex-col items-start justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {assignment?.title}
                            </p>
                            <div className="mx-5 flex items-center text-sm text-gray-500 sm:mt-0">
                              <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <p>
                                Due on{" "}
                                {assignment?.endDate &&
                                  format(assignment?.endDate, "yy-MM-dd HH-MM")}
                              </p>{" "}
                            </div>
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                              {assignment?.courseName}
                            </p>
                          </div>
                          <div className="  flex-shrink-0 flex max-w-[75%]">
                            <p className="flex items-center text-sm text-gray-500">
                              <span className="  flex-wrap">
                                {assignment?.description}
                              </span>
                            </p>
                          </div>
                        </div>

                        {userData?.role == "STUDENT" ? (
                          <aside className="mt-2 sm:flex sm:justify-between">
                            {submission ? (
                              <div>
                                Score : {submission?.score} /{" "}
                                {submission?.assignmentId?.questions?.length ||
                                  0}
                              </div>
                            ) : isAssignmentActive(assignment) ? (
                              <Link to={`/assignment/${assignment._id}`}>
                                <Button className="cursor-pointer">
                                  Attempt
                                </Button>
                              </Link>
                            ) : isAssignmentOverDue(assignment) ? (
                              <p>Over Due</p>
                            ) : (
                              <Button disabled className="cursor-pointer">
                                Starting:{" "}
                                {assignment?.startDate &&
                                  format(
                                    assignment?.startDate,
                                    "yy-MM-dd HH-MM"
                                  )}
                              </Button>
                            )}
                          </aside>
                        ) : (
                          <p className="text-sm">
                            Starting:{" "}
                            {assignment?.startDate &&
                              format(assignment?.startDate, "yy-MM-dd HH-MM")}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-5 text-center text-sm text-gray-500">
                  No assignments found matching your search.
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
