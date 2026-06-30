import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Courses from "../pages/Courses/Courses";
import CourseDetails from "../pages/CourseDetails/CourseDetails";
import Dashboard from "../pages/Dashboard/Dashboard";
import InstructorDashboard from "../pages/Instructor/InstructorDashboard";

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/courses" element={<Courses />} />

          <Route path="/courses/:id" element={<CourseDetails />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/instructor/dashboard"
            element={<InstructorDashboard />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;