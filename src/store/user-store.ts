import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import userService from "../services/user.service";

export class SessionUser {
  id: string;
  username: string;
  role: string;
  accessToken?: string;
}

interface UserState {
  userData: SessionUser | null;
  profileData: any;
  accessToken: string | null;
  userIsSignedIn: boolean;
  redirectUrl: string | null;
  isLoading: boolean;
  isHydrating: boolean;

  setUserData: (data: SessionUser | null) => void;
  setAccessToken: (token: string | null) => void;

  login: (data) => Promise<unknown>;
  register: (data) => Promise<unknown>;
  logOut: () => Promise<void>;
  fetchProfileData: () => Promise<void>;
  setIsHydrating: (isHydrating: boolean) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // initial states
      userData: null,
      profileData: null,
      accessToken: null,
      refToken: null,
      userIsSignedIn: false,
      redirectUrl: null,
      isLoading: false, // Initially false
      isHydrating: true, // Start with true while hydrating
      // .ACTIONS*****************************************
      setUserData: (data: SessionUser) => set({ userData: data }),
      setAccessToken: (token: string) => set({ accessToken: token }),
      setIsHydrating: (isHydrating) => set({ isHydrating }), // Function to set loading state

      //methods

      // log user out ********************************************************
      logOut: async () => {
        const { userData, accessToken } = get();
        if (!accessToken && !userData) {
          toast.error("You are not Logged in!");
          return;
        }

        // set({ isLoading: true });

        try {
          set({
            accessToken: null,
            userData: null,
          });
          // localStorage.clear();
          toast.success("Successfully Signed Out!");
        } catch (error) {
          console.log(error);
        } finally {
          // set({ isLoading: false });
        }
      },

      // sign user in *********************************************************
      login: async ({ username, password }) => {
        if (!password?.trim() || !username?.trim()) {
          return toast.error("username and password is required!");
        }

        set({ isLoading: true });

        try {
          const { data, message } = await userService.loginUser({
            username,
            password,
          });

          toast.success(message);
          if (data) {
            if (!username) {
              toast.error("Invalid username! please refresh and login");
              return;
            }
            get().setAccessToken(data.accessToken);
            get().setUserData({
              id: data.id,
              username: data.username,
              role: data.role,
            });

            // redirect to previously redirect url else home
            return true;
          } else {
            return false;
          }
        } catch (error) {
          toast.success(error?.response?.data?.message);

          console.error(error);
        } finally {
          set({ isLoading: false });
        }
      },

      // sign user in *********************************************************
      register: async (registerDto) => {
        if (!registerDto) {
          return toast.error("Missing details!");
        }

        set({ isLoading: true });

        try {
          const { data, message } = await userService.registerUser(registerDto);

          if (data) {
            toast.success(message);
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error(error);
          // handleAxiosError(error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Fetch all submissions for an assignment
      fetchProfileData: async ( ) => {
        try {
          const profileData = await userService.getUserProfile();
          set({ profileData });
        } catch (error) {
          console.log(error);
        }
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        accessToken: state.accessToken,
        userData: state.userData,
      }), // Only persist accessToken & userData
      onRehydrateStorage: () => (state) => {
        // When rehydrating from localStorage, set loading to false after the store is populated
        if (state) {
          state.setIsHydrating(false);
        }
      },
    }
  )
);

export default useUserStore;
