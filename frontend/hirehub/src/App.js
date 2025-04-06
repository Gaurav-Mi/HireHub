import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import LoginJobSeeker from "./components/LoginJobSeeker";

import Homepage from "./components/Homepage";
import EmployerDashboard from "./components/EmployerDashboard";
import Jobs from "./components/Jobs";
import LoginEmployer from "./components/LoginEmployer";
import JobSeekerDashboard from "./components/JobSeekerDashboard";
import Companies from "./components/Companies";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Aboutus from "./components/Aboutus";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login/job_seeker" element={<LoginJobSeeker />} />
        <Route path="/login/employer" element={<LoginEmployer />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/job_seeker/dashboard" element={<JobSeekerDashboard />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="jobs" element={<Jobs />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/aboutus" element={<Aboutus />} />
      </Routes>
    </>
  );
}

export default App;
