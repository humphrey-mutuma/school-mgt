"use client";

import { useForm, Controller } from "react-hook-form";
import { CheckCircle, Clock, FileText, User } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";
import toast from "react-hot-toast";
import { useState } from "react";
import submissionService from "../services/submission.service";
import useUserStore from "../store/user-store";
import { useNavigate } from "react-router-dom";

interface StudentAnswers {
  answers: Record<string, number>; // questionId -> selectedOptionIndex
}

export default function AssignmentAnswering({ assignment }) {
  const { userData } = useUserStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StudentAnswers>({
    defaultValues: {
      answers: {},
    },
  });

  const watchedAnswers = watch("answers");

  // Helper function to format ISO string for display
  const formatIsoForDisplay = (
    isoString: string
  ): { date: string; time: string } => {
    if (!isoString) return { date: "", time: "" };
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return { date: "", time: "" };

    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return { date: dateStr, time: timeStr };
  };

  // Check if assignment is currently active
  const isAssignmentActive = () => {
    const now = new Date();
    const startDate = new Date(assignment.startDate);
    const endDate = new Date(assignment.endDate);
    return now >= startDate && now <= endDate;
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    const now = new Date();
    const endDate = new Date(assignment.endDate);
    const timeLeft = endDate.getTime() - now.getTime();

    if (timeLeft <= 0) return "Time's up!";

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  // Handle form submission
  const onSubmit = async (data: StudentAnswers) => {
    setIsSubmitting(true);
    console.log("answrde", data);

    try {
      // In a real application, you would send this data to your API

      // Format the data for submission
      const formattedData = assignment.questions?.map((question, index) => ({
        questionId: question._id,
        studentAnswer: data.answers?.[index], // Use index to get the answer
        studentId: userData?.id,
        assignmentId: assignment?._id,
      }));

      const res = await submissionService.submitAssignment(formattedData);
      if (res) {
        navigate("/");
        toast.success(res?.message);
        setSubmitted(true);
      }
      // Simulate API call
    } catch (error) {
      console.error("Error submitting answers:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assignment.questions || assignment.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Assignment Available
              </h2>
              <p className="text-gray-600">
                There are no questions to answer at this time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Assignment Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {assignment.title}
              </h1>
              <p className="text-lg text-blue-600 font-medium">
                {assignment.courseName}
              </p>
            </div>
            <div className="text-right">
              <Badge
                variant={isAssignmentActive() ? "default" : "secondary"}
                className="mb-2"
              >
                {isAssignmentActive() ? "Active" : "Inactive"}
              </Badge>
              {isAssignmentActive() && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Clock className="h-4 w-4" />
                  {getTimeRemaining()}
                </div>
              )}
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-gray-700 mb-4">{assignment.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Start:</span>
                  <div className="text-gray-600">
                    {formatIsoForDisplay(assignment.startDate).date} at{" "}
                    {formatIsoForDisplay(assignment.startDate).time}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-900">End:</span>
                  <div className="text-gray-600">
                    {formatIsoForDisplay(assignment.endDate).date} at{" "}
                    {formatIsoForDisplay(assignment.endDate).time}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Questions:</span>
                  <div className="text-gray-600">
                    {assignment.questions.length} questions
                  </div>
                </div>
              </div>
            </CardContent>

            <hr />
            {/* Student Information */}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentName">
                  Full Name : {userData.username}
                </Label>
              </div>

              <div>
                <Label htmlFor="studentId">Student ID: {userData.id}</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Questions */}
          <div className="space-y-6">
            {assignment.questions.map((question, questionIndex) => (
              <Card
                key={question.id || questionIndex}
                className="border-l-4 border-l-green-500"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Question {questionIndex + 1}
                    </CardTitle>
                    {watchedAnswers?.[
                      question.id || questionIndex.toString()
                    ] !== undefined && (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Answered
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-gray-900 font-medium">
                    {question.question}
                  </div>

                  <Controller
                    control={control}
                    name={`answers.${question.id || questionIndex.toString()}`}
                    rules={{ required: "Please select an answer" }}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value?.toString()}
                        onValueChange={(value) =>
                          field.onChange(Number.parseInt(value))
                        }
                      >
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <RadioGroupItem
                              value={optionIndex.toString()}
                              id={`q${questionIndex}-option${optionIndex}`}
                            />
                            <Label
                              htmlFor={`q${questionIndex}-option${optionIndex}`}
                              className="flex-1 cursor-pointer"
                            >
                              <span className="font-medium text-gray-700 mr-2">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {errors.answers?.[
                    question.id || questionIndex.toString()
                  ] && (
                    <p className="text-sm text-red-600">
                      {
                        errors.answers[question.id || questionIndex.toString()]
                          ?.message
                      }
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Submit Button */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Make sure you've answered all questions before submitting.
                </div>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Assignment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
