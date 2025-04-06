import React from "react";

function Aboutus() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-24 pb-12 lg:px-16 flex flex-col items-center">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-6">
          About Us
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Welcome to{" "}
          <span className="font-semibold text-indigo-600">HireHub</span> — your
          one-stop platform for connecting ambitious job seekers with top-notch
          employers. Our mission is to streamline the hiring process and make
          meaningful career connections.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          We understand the challenges in today’s job market, and that’s why
          we’ve built a platform that’s simple, fast, and effective. Whether
          you're an employer looking for talent or a candidate looking for your
          dream job, we’ve got you covered.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed">
          At <span className="font-semibold text-indigo-600">HireHub</span>, we
          value innovation, transparency, and results. Join our community and
          take your hiring or job search journey to the next level.
        </p>
      </div>
    </div>
  );
}

export default Aboutus;
