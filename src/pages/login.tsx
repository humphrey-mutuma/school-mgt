"use client";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import PagesLayout from "../layouts/PagesLayout";
import useUserStore from "../store/user-store";
import { useForm } from "react-hook-form";

type FormValues = {
  username: string;
  password: string;
};

export default function Login() {
  const { login } = useUserStore();
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
     const res = await login(data);
    if (res) {
      navigate("/");
      reset();
    }
    // login(data);
    // Here you would typically handle authentication
  };
  return (
    <PagesLayout>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  required
                  {...register("username")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  {...register("password")}
                />
              </div>{" "}
            </CardContent>
            <br />
            <CardFooter>
              <Button className="w-full" type="submit">
                Log In
              </Button>
            </CardFooter>
          </form>

          <CardDescription className="text-center ">
            Don't have an account yet?{" "}
            <Link to={"/register"}>
              <Button variant="outline" className="ml-2 ">
                Create Account
              </Button>
            </Link>
          </CardDescription>
        </Card>
      </div>
    </PagesLayout>
  );
}
