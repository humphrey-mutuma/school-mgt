"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Check, User } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import submissionService from "../services/submission.service";
import toast from "react-hot-toast";

// Create a schema for the form validation
const createGradingSchema = (submission) => {
  const shape: Record<string, z.ZodNumber> = {};

  submission.answers.forEach((answer) => {
    shape[`score_${answer._id}`] = z.coerce
      .number()
      .min(0, "Score cannot be negative")
      .max(
        answer.questionId.maxScore,
        `Maximum score is ${answer.questionId.maxScore}`
      );
  });

  return z.object(shape);
};
export default function StudentSubmissionsGrading({ submissions }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assignment Grading</h1>
        <Badge variant="secondary" className="text-base">
          {submissions.length} Submissions
        </Badge>
      </div>

      <Separator className="my-6" />

      {submissions.map((submission) => (
        <StudentSubmissionTable key={submission._id} submission={submission} />
      ))}
    </div>
  );
}

// Component for a single student's submission
function StudentSubmissionTable({ submission }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Create the form schema based on the answers
  const formSchema = createGradingSchema(submission);
  type FormValues = z.infer<typeof formSchema>;

  // Initialize default values for the form
  const defaultValues: Partial<FormValues> = {};
  submission.answers.forEach((answer) => {
    defaultValues[`score_${answer._id}`] = answer.score;
  });

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Calculate total score and max possible score
  const totalScore = Object.keys(form.getValues()).reduce(
    (sum, key) => sum + (form.getValues(key) as number),
    0
  );

  const maxPossibleScore = submission.answers.reduce(
    (sum, answer) => sum + answer.questionId.maxScore,
    0
  );

  // Handle saving all scores
  const saveAllScores = async () => {
    // Validate all fields
    const isValid = await form.trigger();
    if (!isValid) return;

    const allScores = form.getValues();
    setIsSaving(true);

    try {
      // Format the data for submission
      const formattedData = submission.answers.map((answer) => ({
        answerId: answer._id,
        score: allScores[`score_${answer._id}`],
        studentId: submission.studentId._id,
        submissionId: submission._id,
        questionId: answer.questionId?._id,
      }));

      console.log("Formatted data:", formattedData);
      const res = await submissionService.gradeSubmission(formattedData);
      // Simulate API call
      if (res) {
        toast.success(res.message);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error saving scores:", error);
      alert("Failed to save scores. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full mb-8">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Student: {submission.studentId.username}</CardTitle>
          </div>
          <Badge variant="outline" className="text-base">
            Total: {totalScore}/{maxPossibleScore}
          </Badge>
        </div>
        <CardDescription>Submission ID: {submission._id}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-2">
            {submission.answers.map((answer) => (
              <div
                key={answer._id}
                className="border rounded-md overflow-hidden"
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="w-1/12 font-medium bg-muted/30">
                        Q&A
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {answer.questionId.title}
                        </div>
                        <div className="whitespace-pre-wrap">
                          {answer.answerText}
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium bg-muted/30">
                        Score
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FormField
                            control={form.control}
                            name={`score_${answer._id}`}
                            render={({ field }) => (
                              <FormItem className="flex-1 max-w-[120px]">
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={answer.questionId.maxScore}
                                      className="w-20 text-center"
                                      {...field}
                                    />
                                  </FormControl>
                                  <span className="text-sm text-muted-foreground">
                                    / {answer.questionId.maxScore}
                                  </span>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </Form>
      </CardContent>
      <CardFooter>
        <Button onClick={saveAllScores} disabled={isSaving} className="w-full">
          {isSaved ? (
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Saved Successfully
            </span>
          ) : isSaving ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save All Scores
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
