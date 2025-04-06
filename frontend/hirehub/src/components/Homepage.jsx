import { Link, Navigate } from "react-router-dom";

export default function Homepage() {
  const isLoggedin = !!localStorage.getItem("auth-token");
  const role = localStorage.getItem("role");

  if (isLoggedin && role === "job_seeker") {
    return <Navigate to="/job_seeker/dashboard" />;
  } else if (isLoggedin && role === "employer") {
    return <Navigate to="/employer/dashboard" />;
  } else if (isLoggedin && role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 py-16 px-6">
      <div className="text-center mb-12">
        <img
          alt="HireHub"
          src="https://www.svgrepo.com/show/467051/heading-square-2.svg"
          className="mx-auto h-20 w-20"
        />
        <h1 className="mt-4 text-4xl font-bold text-white">
          Welcome to HireHub
        </h1>
        <p className="mt-2 text-lg text-white opacity-90 max-w-2xl mx-auto">
          Your gateway to a new career or finding talent. Connect, grow, and
          succeed with us!
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 max-w-xl mx-auto">
        {[
          { to: "/login/job_seeker", label: "Login as Job Seeker" },
          { to: "/login/employer", label: "Login as Employer" },
          { to: "/login/admin", label: "Login as Admin" },
        ].map(({ to, label }) => (
          <Link to={to} key={label}>
            <button className="w-52 rounded-lg bg-blue border-2 border-white  text-white  px-6 py-3 text-lg font-semibold shadow-md hover:bg-blue-700 hover:text-indigo-100 transition">
              {label}
            </button>
          </Link>
        ))}
        <Link to="/signup">
          <button className="w-52 rounded-lg border-2 border-white px-6 py-3 text-white text-lg font-semibold shadow-md hover:bg-green-700 hover:text-indigo-100 transition">
            Sign Up
          </button>
        </Link>
      </div>

      <div className="mt-16 text-center text-white opacity-90 max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold">Why Choose HireHub?</h2>
        <p className="mt-4 text-lg">
          Whether you're a job seeker or an employer, HireHub makes it easy to
          find the right match.
        </p>
      </div>
    </div>
  );
}
