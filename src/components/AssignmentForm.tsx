"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "../lib/utils";
import assignmentService from "../services/assignment.service";
import toast from "react-hot-toast";

// Define the form schema with Zod
const questionSchema = z.object({
  title: z.string().min(1, "Question title is required"),
  // description: z.string().min(1, "Question description is required"),
  maxScore: z.coerce.number().min(1, "Max score must be at least 1"),
});

const formSchema = z.object({
  courseName: z.string().min(1, "Course name is required"),
  title: z.string().min(1, "Assignment title is required"),
  description: z.string().min(1, "Assignment description is required"),
  submissionDeadline: z.date({
    required_error: "Submission deadline is required",
  }),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function AssignmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: "",
      title: "",
      description: "",
      questions: [
        {
          title: "",
          // description: "",
          maxScore: 10,
        },
      ],
    },
  });

  // Set up field array for dynamic questions
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted:", data);
    // setIsSubmitting(true);
    try {
      // In a real application, you would send this data to your API
      
      const res = await assignmentService.createAssignment(data);

      if (res) {
        toast.success(res.message);
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="courseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input placeholder="Bsc Computer Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignment Title</FormLabel>
                <FormControl>
                  <Input placeholder="Web Development CAT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of the assignment..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="submissionDeadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Submission Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full md:w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Questions</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ title: "",   maxScore: 10 })
              }
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add Question
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="relative">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Question {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`questions.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter question title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name={`questions.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide details about the question..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name={`questions.${index}.maxScore`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Score</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end pt-0">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
          {form.formState.errors.questions?.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.questions.root.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full md:w-auto cursor-pointer disabled:bg-gray-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Assignment..." : "Create Assignment"}
        </Button>
      </form>
    </Form>
  );
}
