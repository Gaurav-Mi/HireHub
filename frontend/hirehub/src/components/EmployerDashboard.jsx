import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployerJobs from "./EmployerJobs";
import { useNavigate } from "react-router-dom";

const EmployerDashboard = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    category: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshJobs, setRefreshJobs] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const role = localStorage.getItem("role");

    if (!token || role !== "employer") {
      navigate("/login/employer", { replace: true });
    }
  }, [navigate]);

  const onJobPosted = () => {
    setRefreshJobs((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "https://hirehub-q5c4.onrender.com/api/jobs/v1/createjob",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": `${localStorage.getItem("auth-token")}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Job posted successfully!");
        setFormData({
          title: "",
          company: "",
          location: "",
          salary: "",
          description: "",
          category: "",
        });
        onJobPosted();
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (error) {
      setError("Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row justify-between gap-6">
        <div className="w-full lg:w-1/2 bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            Post a New Job
          </h2>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {success && (
            <p className="text-green-600 text-center mb-4">{success}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {["title", "company", "location", "salary", "category"].map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  <input
                    type={field === "salary" ? "number" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="mt-1 block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>

        <div className="w-full lg:w-1/2">
          <EmployerJobs refreshTrigger={refreshJobs} />
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
