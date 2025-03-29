import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main/Main";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import Error from "../pages/Error/Error";
import CheckOut from "../pages/CheckOut/CheckOut";
import Dashboard from "../pages/Dashboard/Dashboard";
import FindBlood from "../pages/FindBlood/FindBlood";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ApiTest from "../pages/ApiTest";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "find-blood",
        element: <FindBlood />,
      },
      {
        path: "api-test",
        element: <ApiTest />,
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "checkout/:id",
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/donors/${params.id}`),
        element: (
          <PrivateRoute>
            <CheckOut />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router; 