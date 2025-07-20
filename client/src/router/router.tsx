import { createBrowserRouter } from "react-router-dom";
import Username from "../components/Username";
import Register from "../components/Register";
import Password from "../components/Password";
import Profile from "../components/Profile";
import Recovery from "../components/Recovery";
import Reset from "../components/Reset";
import PageNotFound from "../components/PageNotFound";
import { AuthorizeUser, ProtectRoute } from "../middleware/auth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Username />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/password",
    element: (
      <ProtectRoute>
        <Password />
      </ProtectRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthorizeUser>
        <Profile />
      </AuthorizeUser>
    ),
  },
  {
    path: "/recovery",
    element: (
      <ProtectRoute>
        <Recovery />
      </ProtectRoute>
    ),
  },
  {
    path: "/reset",
    element: (
      <ProtectRoute>
        <Reset />
      </ProtectRoute>
    ),
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
