"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Plus,
  Trash2,
  Calendar,
  Clock,
  BookOpen,
  FileText,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";
import toast from "react-hot-toast";
import { useState } from "react";
import assignmentService from "../services/assignment.service";

export default function AssignmentDashboard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseName: "",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const watchedQuestions = watch("questions");
  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");

  const handleStartDateTimeChange = (datetime: string) => {
    setValue("startDate", datetime);
  };

  const handleEndDateTimeChange = (datetime: string) => {
    setValue("endDate", datetime);
  };

  const addQuestion = () => {
    append({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const res = await assignmentService.createAssignment(data);
      if (res) {
        toast.success(res.message);
        reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation function for end datetime
  const validateEndDateTime = (endDatetime: string) => {
    if (watchedStartDate && endDatetime && endDatetime <= watchedStartDate) {
      return "End date and time must be after start date and time";
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Assignment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assignment Details
              </CardTitle>
              <CardDescription>
                Basic information about your assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  placeholder="Enter course name..."
                  {...register("courseName", {
                    required: "Course name is required",
                    minLength: {
                      value: 2,
                      message: "Course name must be at least 2 characters long",
                    },
                  })}
                />
                {errors.courseName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.courseName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  placeholder="Enter assignment title..."
                  {...register("title", {
                    required: "Assignment title is required",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters long",
                    },
                  })}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide instructions and context for the assignment..."
                  rows={3}
                  {...register("description", {
                    required: "Assignment description is required",
                    minLength: {
                      value: 10,
                      message:
                        "Description must be at least 10 characters long",
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date & Time
                  </Label>
                  <Controller
                    control={control}
                    name="startDate"
                    rules={{
                      required: "Start date and time is required",
                    }}
                    render={({ field }) => (
                      <Input
                        type="datetime-local"
                        value={watchedStartDate}
                        onChange={(e) =>
                          handleStartDateTimeChange(e.target.value)
                        }
                        className="w-full"
                      />
                    )}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.startDate?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    End Date & Time
                  </Label>
                  <Controller
                    control={control}
                    name="endDate"
                    rules={{
                      required: "End date and time is required",
                      validate: () => {
                        return validateEndDateTime(watchedEndDate);
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="datetime-local"
                        value={watchedEndDate}
                        onChange={(e) =>
                          handleEndDateTimeChange(e.target.value)
                        }
                        className="w-full"
                      />
                    )}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.endDate?.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Multiple Choice Questions</CardTitle>
                  <CardDescription>
                    Add questions with multiple choice answers
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {fields.length} question{fields.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {fields.map((field, questionIndex) => (
                  <Card key={field.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Question {questionIndex + 1}
                        </CardTitle>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(questionIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor={`questions.${questionIndex}.question`}>
                          Question Text
                        </Label>
                        <Textarea
                          id={`questions.${questionIndex}.question`}
                          placeholder="Enter your question..."
                          {...register(`questions.${questionIndex}.question`, {
                            required: "Question text is required",
                            minLength: {
                              value: 5,
                              message:
                                "Question must be at least 5 characters long",
                            },
                          })}
                        />
                        {errors.questions?.[questionIndex]?.question && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.questions[questionIndex]?.question?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Answer Options</Label>
                        <Controller
                          control={control}
                          name={`questions.${questionIndex}.correctAnswer`}
                          rules={{
                            required: "Please select the correct answer",
                          }}
                          render={({ field: radioField }) => (
                            <RadioGroup
                              value={radioField.value?.toString()}
                              onValueChange={(value) =>
                                radioField.onChange(Number.parseInt(value))
                              }
                            >
                              {[0, 1, 2, 3].map((optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="flex items-center space-x-3 p-3 border rounded-lg"
                                >
                                  <RadioGroupItem
                                    value={optionIndex.toString()}
                                    id={`q${questionIndex}-option${optionIndex}`}
                                  />
                                  <div className="flex-1">
                                    <Input
                                      placeholder={`Option ${String.fromCharCode(
                                        65 + optionIndex
                                      )}`}
                                      {...register(
                                        `questions.${questionIndex}.options.${optionIndex}`,
                                        {
                                          required: "Option text is required",
                                        }
                                      )}
                                    />
                                    {errors.questions?.[questionIndex]
                                      ?.options?.[optionIndex] && (
                                      <p className="text-xs text-red-600 mt-1">
                                        {
                                          errors.questions[questionIndex]
                                            ?.options?.[optionIndex]?.message
                                        }
                                      </p>
                                    )}
                                  </div>
                                  {watchedQuestions?.[questionIndex]
                                    ?.correctAnswer === optionIndex && (
                                    <Badge
                                      variant="default"
                                      className="bg-green-100 text-green-800"
                                    >
                                      Correct
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </RadioGroup>
                          )}
                        />
                        {errors.questions?.[questionIndex]?.correctAnswer && (
                          <p className="text-sm text-red-600 mt-1">
                            {
                              errors.questions[questionIndex]?.correctAnswer
                                ?.message
                            }
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          Select the radio button next to the correct answer
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addQuestion}
                  className="w-full border-dashed border-2 h-12 text-gray-600 hover:text-gray-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Question
                </Button>

                {fields.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>
                      No questions added yet. Click "Add New Question" to get
                      started.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Assignment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
