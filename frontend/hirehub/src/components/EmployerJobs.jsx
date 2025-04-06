import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEmployerJobs } from "../redux/Actions/jobActions";
import axios from "axios";

const EmployerJobs = ({ refreshTrigger }) => {
  const jobs = useSelector((state) => state.jobs.employerJobs || []);
  const dispatch = useDispatch();

  const [editJobId, setEditJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    category: "",
  });

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const response = await axios.get(
          "https://hirehub-q5c4.onrender.com/api/jobs/v1/employerjobs",
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("auth-token"),
            },
          }
        );
        dispatch(getEmployerJobs(response.data));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchEmployerJobs();
  }, [dispatch, refreshTrigger]);

  const deleteJob = async (jobId) => {
    try {
      await axios.delete(
        `https://hirehub-q5c4.onrender.com/api/jobs/v1/deletejob/${jobId}`,
        {
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      );
      // Refresh jobs after deletion
      const response = await axios.get(
        "https://hirehub-q5c4.onrender.com/api/jobs/v1/employerjobs",
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      );
      dispatch(getEmployerJobs(response.data));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const startEditing = (job) => {
    setEditJobId(job._id);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
      category: job.category,
    });
  };

  const cancelEdit = () => {
    setEditJobId(null);
    setFormData({
      title: "",
      description: "",
      location: "",
      salary: "",
      category: "",
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveJob = async (jobId) => {
    try {
      await axios.put(
        `https://hirehub-q5c4.onrender.com/api/jobs/v1/updatejob/${jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      );
      cancelEdit();

      // Refresh jobs after saving
      const response = await axios.get(
        "https://hirehub-q5c4.onrender.com/api/jobs/v1/employerjobs",
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      );
      dispatch(getEmployerJobs(response.data));
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleStatusUpdate = async (jobId, userId, status) => {
    try {
      await axios.put(
        `https://hirehub-q5c4.onrender.com/api/jobs/v1/updatejobstatus/${jobId}/${userId}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      );

      // Refresh jobs after status update
      const response = await axios.get(
        "https://hirehub-q5c4.onrender.com/api/jobs/v1/employerjobs",
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      );
      dispatch(getEmployerJobs(response.data));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="mt-10 w-full max-w-4xl mx-10">
      <h2 className="text-2xl font-bold text-center mb-6">Your Posted Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border p-4 rounded shadow-md bg-white flex flex-col justify-between"
            >
              {editJobId === job._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    placeholder="Job Title"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    placeholder="Job Description"
                  />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    placeholder="Location"
                  />
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    placeholder="Salary"
                  />
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    placeholder="Category"
                  />
                  <div className="flex justify-end mt-2 gap-2">
                    <button
                      onClick={() => saveJob(job._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <p className="text-gray-700">{job.description}</p>
                    <p>
                      <strong>Location:</strong> {job.location}
                    </p>
                    <p>
                      <strong>Salary:</strong> {job.salary} INR
                    </p>
                    <p>
                      <strong>Category:</strong> {job.category}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mt-4">Applicants:</h4>
                    {(job.applicants || []).length > 0 ? (
                      <ul className="list-disc list-inside text-gray-700 space-y-1 mt-1">
                        {job.applicants.map((applicant, index) => (
                          <li key={index} className="mb-2 border-b pb-2">
                            <div>
                              <span className="font-medium">Name: </span>
                              {applicant.user.name} <br />
                              <span className="font-medium">Email: </span>
                              {applicant.user.email} <br />
                              <span className="font-medium">Status: </span>
                              <span className="capitalize">
                                {applicant.status || "pending"}
                              </span>
                            </div>
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    job._id,
                                    applicant.user._id,
                                    "approved"
                                  )
                                }
                                disabled={applicant.status !== "pending"}
                                className={`px-2 py-1 rounded text-white ${
                                  applicant.status !== "pending"
                                    ? "bg-green-300 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                }`}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    job._id,
                                    applicant.user._id,
                                    "rejected"
                                  )
                                }
                                disabled={applicant.status !== "pending"}
                                className={`px-2 py-1 rounded text-white ${
                                  applicant.status !== "pending"
                                    ? "bg-red-300 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700"
                                }`}
                              >
                                Reject
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No applicants yet.</p>
                    )}
                  </div>

                  <div className="flex justify-end mt-4 gap-3">
                    <button
                      onClick={() => startEditing(job)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerJobs;
