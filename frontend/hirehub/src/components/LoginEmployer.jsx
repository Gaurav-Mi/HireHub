import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  loginRequest,
  loginFailure,
  loginSuccess,
} from "../redux/Actions/authAction";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginEmployer() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginRequest());

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/v1/loginemployer",
        formData
      );

      if (response.data.token && response.data.user) {
        const { token, user } = response.data;

        localStorage.setItem("auth-token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("user", JSON.stringify(user));

        dispatch(loginSuccess(user, user.role));
        setSuccess("Login successful!");

        setFormData({ email: "", password: "" });

        setTimeout(() => {
          setSuccess(null);
          navigate("/employer/dashboard", { replace: true });
        }, 1000);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.blocked
      ) {
        setError(error.response.data.blocked);
        dispatch(loginFailure("User is blocked"));
      } else {
        setError("Invalid credentials");
        dispatch(loginFailure("Invalid credentials"));
      }

      setTimeout(() => setError(null), 2000);
    }
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
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
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
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                  onChange={handleChange}
                  value={formData.password}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                Sign in
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
