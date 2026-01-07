import HomePage from "@/pages/HomePage";
import LoginForm from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import MainLayout from "@/layout/MainComponent";
import UserDashboard from "@/pages/UserDashboard";
import { createBrowserRouter } from "react-router-dom";
 import Page404 from '@/pages/Page404'
import PasswordResetPage from "@/components/auth/PasswordReset";
import Profile from "@/components/dashboard/Profile";
 

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "login", Component: LoginForm },
      { path: "register", Component: RegisterPage },
      { path: "dashboard", Component: UserDashboard },
      {path: "reset-password", Component:PasswordResetPage},
      {path : 'profile', Component:Profile},
      { path: "404", Component: Page404 },
    ],
  },
]);

export default router;
