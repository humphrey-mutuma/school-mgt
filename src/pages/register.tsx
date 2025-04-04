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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import PagesLayout from "../layouts/PagesLayout";
import { useForm } from "react-hook-form";
import userService from "../services/user.service";
import toast from "react-hot-toast";

type FormValues = {
  username: string;
  password: string;
  role: "STUDENT" | "LECTURER";
};

export default function Register() {
  // const { register } = useUserStore();
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<FormValues>({
      defaultValues: {
        username: "",
        password: "",
        role: "STUDENT",
      },
    });

  const navigate = useNavigate();
  // Need to watch role for the controlled select component
  const watchedRole = watch("role");

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted:", data);
    const new_user = await userService.registerUser(data);
    if (new_user) {
      toast.success(new_user.message);
      navigate("/login");
      reset();
    }
    // Here you would typically handle authentication
  };
  return (
    <PagesLayout>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create Account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to create an account
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
              </div>
              <div className="space-y-2 w-full  ">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={watchedRole}
                  onValueChange={(value) =>
                    setValue("role", value as "STUDENT" | "LECTURER")
                  }
                >
                  <SelectTrigger className="  w-full  " id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">STUDENT</SelectItem>
                    <SelectItem value="LECTURER">LECTURER</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit">
                Sign in
              </Button>
            </CardFooter>
          </form>

          <CardDescription className="text-center ">
            Already has an account?{" "}
            <Link to={"/login"}>
              {" "}
              <Button variant="outline" className="ml-2 ">
                Log In here
              </Button>
            </Link>
          </CardDescription>
        </Card>
      </div>
    </PagesLayout>
  );
}
