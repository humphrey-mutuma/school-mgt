"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { format } from "date-fns";
import useUserStore from "../store/user-store";
import submissionService from "../services/submission.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Create a schema for the form validation
const createAnswerSchema = (questions: any[]) => {
  const shape: Record<string, z.ZodString> = {};

  questions.forEach((question) => {
    shape[`answer_${question._id}`] = z.string().min(1, "Answer is required");
  });

  return z.object(shape);
};

export default function AssignmentAnswerForm({ assignment }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { userData } = useUserStore();
  const navigate = useNavigate();
  // Get the questions from the sample assignment
  const questions = assignment?.questions;

  // Create the form schema based on the questions
  const formSchema = createAnswerSchema(questions);
  type FormValues = z.infer<typeof formSchema>;

  // Initialize default values for the form
  const defaultValues: Partial<FormValues> = {};
  questions?.forEach((question) => {
    defaultValues[`answer_${question._id}`] = "";
  });

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // In a real application, you would send this data to your API
      console.log("Answers submitted:", data);

      // Format the data for submission
      const formattedData = questions?.map((question) => ({
        questionId: question._id,
        answerText: data[`answer_${question._id}`],
        studentId: userData.id,
        assignmentId: assignment?._id,
      }));

      console.log("Formatted answers:", formattedData);

      const res = await submissionService.submitAssignment(formattedData);
      if (res) {
        toast.success(res?.message);
        setSubmitted(true);
      }
      // Simulate API call
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Failed to submit answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto my-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">
          Answers Submitted Successfully!
        </h2>
        <p className="mb-6">Your answers have been submitted for grading.</p>
        <Button onClick={() => navigate("/")}>Return to dashboard</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{assignment?.title}</h1>
        <p className="text-lg text-muted-foreground mb-2">
          {assignment?.courseName}
        </p>
        <p className="mb-2">{assignment?.description}</p>
        <p className="text-sm text-muted-foreground">
          Due On:{" "}
          {format(assignment?.submissionDeadline, "MMMM do, yyyy, hh:mm a")}
        </p>{" "}
        <p className="text-sm text-muted-foreground">
          Created On: {format(assignment?.createdAt, "MMMM do, yyyy, hh:mm a")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {questions &&
            questions?.map((question, index) => (
              <Card key={question?._id} className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-start">
                    <span className="mr-2">Q{index + 1}.</span>
                    <span>{question?.title}</span>
                  </CardTitle>
                  <CardDescription>{question?.description}</CardDescription>
                  <div className="text-sm text-muted-foreground mt-1">
                    Max Score: {question?.maxScore} points
                  </div>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name={`answer_${question?._id}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Answer</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your answer here..."
                            className="min-h-[100px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}

          <div className="sticky bottom-4 bg-background p-4 border rounded-lg shadow-lg">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit All Answers"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
