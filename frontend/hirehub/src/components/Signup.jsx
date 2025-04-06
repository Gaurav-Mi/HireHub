import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://hire-hub-liard.vercel.app/api/auth/v1/signup",
        formData
      );
      if (response.data.success) {
        setSuccess(
          "Account created successfully! You will be redirected to login page shortly."
        );
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "",
        });
      }
      setTimeout(() => setSuccess(null), 3000);
      if (formData.role === "job_seeker") {
        setTimeout(() => {
          navigate("/login/job_seeker", { replace: true });
        }, 3000);
      } else if (formData.role === "employer") {
        setTimeout(() => {
          navigate("/login/employer", { replace: true });
        }, 3000);
      } else if (formData.role === "admin") {
        setTimeout(() => {
          navigate("/login/admin", { replace: true });
        }, 3000);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.exist) {
          setError(error.response.data.exist);
        } else {
          setError("An error occurred during sign up. Please try again."); // General error message
        }
      }
    }
    setTimeout(() => setError(null), 3000);
  };
  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Hirehub"
            src="https://www.svgrepo.com/show/467051/heading-square-2.svg"
            className="mx-auto h-10 w-auto"
          />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  onChange={handleChange}
                  value={formData.email}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={handleChange}
                  value={formData.password}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-900"
              >
                Select Role
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  name="role"
                  required
                  onChange={handleChange}
                  value={formData.role}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                >
                  <option value="">Choose a role</option>
                  <option value="job_seeker">Job_Seeker</option>
                  <option value="employer">Employer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>
          <div style={{ height: "100px", marginTop: "10px" }}>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mt-2">{success}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
