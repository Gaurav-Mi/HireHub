import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getJobs } from "../redux/Actions/jobActions";
import { useNavigate } from "react-router-dom";

const JobSeekerDashboard = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = !!localStorage.getItem("auth-token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "job_seeker" || !auth) {
      navigate("/login/job_seeker", { replace: true });
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/jobs/v1/listalljobs"
        );
        const allJobs = response.data;

        dispatch(getJobs(allJobs));

        const applied = allJobs.filter((job) =>
          job.applicants.find((app) => app.user === userId)
        );

        setAppliedJobs(applied);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (userId) {
      fetchJobs();
    }
  }, [dispatch, userId, navigate, auth, role]);

  return (
    <div className="container mx-auto py-8 px-4 mt-16">
      <h2 className="text-3xl font-bold mb-6 text-center">My Job Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appliedJobs.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">
            You haven't applied to any jobs yet.
          </p>
        ) : (
          appliedJobs.map((job) => {
            const applicant = job.applicants.find((app) => app.user === userId);
            return (
              <div
                key={job._id}
                className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-md transition-shadow duration-300 relative"
              >
                <h2 className="text-xl font-semibold text-dark-900 mb-2">
                  {job.company}
                </h2>
                <h6 className="text-xl font-semibold text-blue-600 mb-2">
                  {job.title}
                </h6>
                <p className="text-gray-700 mb-2">{job.description}</p>
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Salary:</strong> ₹{job.salary}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Status:</strong> {applicant?.status || "Unknown"}
                </p>

                <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Applied
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
