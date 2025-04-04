import { GraduationCap } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/user-store";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

export default function NavBar() {
  const { userData, logOut } = useUserStore();
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to={"/"}>
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>{" "}
          </div>
        </Link>
        <div>
          {userData?.role && (
            <p className=" outline-0 px-2  border rounded-full bg-sky-100">
              {userData?.role}
            </p>
          )}
        </div>
        <div className="flex items-center">
          {userData?.username ? (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="border cursor-pointer">
                    <Avatar className="mr-2">
                      <AvatarFallback>
                        {userData?.username.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    {userData?.username}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <Button
                      className="w-full m-0 border-0 outline-0 cursor-pointer "
                      onClick={() => logOut()}
                    >
                      Log Out
                    </Button>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <Button className="" onClick={() => navigate("/login")}>
              Log In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
