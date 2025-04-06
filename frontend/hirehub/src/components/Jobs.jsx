import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getJobs } from "../redux/Actions/jobActions";

const Jobs = () => {
  const jobs = useSelector((state) => state.jobs.jobs || []);
  const role = localStorage.getItem("role");
  const dispatch = useDispatch();

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [appliedJobsList, setAppliedJobsList] = useState([]);

  const [searchTitle, setSearchTitle] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "https://hirehub-q5c4.onrender.com/api/jobs/v1/listalljobs"
        );
        const allJobs = response.data;
        dispatch(getJobs(allJobs));

        if (userId) {
          const appliedJobIds = allJobs
            .filter(
              (job) => !!job.applicants.find((app) => app.user === userId)
            )
            .map((job) => job._id);

          setAppliedJobsList(appliedJobIds);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [dispatch, userId]);

  const applyJob = async (jobId) => {
    try {
      const response = await axios.post(
        `https://hirehub-q5c4.onrender.com/api/jobs/v1/applyjob/${jobId}`,
        {},
        {
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      );

      setAppliedJobsList((prev) => [...prev, jobId]);

      setAlertType("success");
      setAlertMessage("Successfully applied to the job!");
      setTimeout(() => setAlertMessage(""), 3000);
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Failed to apply for job.");
      setTimeout(() => setAlertMessage(""), 3000);
      console.error("Error applying for job:", error);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesTitle = job.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase());
    const matchesCompany = job.company
      .toLowerCase()
      .includes(searchCompany.toLowerCase());
    const matchesLocation = job.location
      .toLowerCase()
      .includes(searchLocation.toLowerCase());
    return matchesTitle && matchesCompany && matchesLocation;
  });

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Jobs</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Job Title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Search by Company"
          value={searchCompany}
          onChange={(e) => setSearchCompany(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Search by Location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <p>No jobs match your search criteria.</p>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="border p-4 rounded shadow-md bg-white"
            >
              <h1 className="text-xl font-semibold">{job.company}</h1>
              <h5 className="text-xl font-semibold">{job.title}</h5>
              <p className="text-gray-700">{job.description}</p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Salary:</strong> {job.salary}
              </p>

              {role === "job_seeker" && (
                <>
                  <div className="mt-4 p-2 bg-gray-100 rounded-md">
                    <p className="text-sm text-gray-600">
                      <strong>Posted By:</strong>{" "}
                      <span className="font-semibold text-gray-800">
                        {job.postedBy?.name || "Unknown"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong>{" "}
                      <span className="text-blue-500">
                        {job.postedBy?.email || "N/A"}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => applyJob(job._id)}
                    className={`block mt-3 px-4 py-2 rounded text-center text-white ${
                      appliedJobsList.includes(job._id)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={appliedJobsList.includes(job._id)}
                  >
                    {appliedJobsList.includes(job._id)
                      ? "Applied"
                      : "Apply Now"}
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {alertMessage && (
        <div
          className={`p-3 my-4 rounded text-white ${
            alertType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default Jobs;
