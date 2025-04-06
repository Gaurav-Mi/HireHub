import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("auth-token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin" || !token) {
      navigate("/", { replace: true });
    } else {
      fetchJobs();
      fetchUsers();
    }
    // eslint-disable-next-line
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "https://hirehub-q5c4.onrender.com/api/jobs/v1/listalljobs",
        {
          headers: {
            "auth-token": token,
          },
        }
      );
      setJobs(response.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://hirehub-q5c4.onrender.com/api/auth/v1/getalluser",
        {
          headers: {
            "auth-token": token,
          },
        }
      );
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(
        `https://hirehub-q5c4.onrender.com/api/jobs/v1/deletejob/${jobId}`,
        {
          headers: {
            "auth-token": token,
          },
        }
      );
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error("Failed to delete job:", err);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await axios.put(
        `https://hirehub-q5c4.onrender.com/api/auth/v1/blockuser/${userId}`,
        {},
        {
          headers: {
            "auth-token": token,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isBlocked: true } : user
        )
      );
    } catch (err) {
      console.error("Failed to block user:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">All Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center">
            No jobs available right now.
          </p>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.description}</p>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete Job
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">All Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-500 text-center">
            No users found in the system.
          </p>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <div key={user._id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Role: {user.role} | Status:{" "}
                  {user.isBlocked ? "Blocked" : "Active"}
                </p>
                {!user.isBlocked && (
                  <button
                    onClick={() => handleBlockUser(user._id)}
                    className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Block User
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
