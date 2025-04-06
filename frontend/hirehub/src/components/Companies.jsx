import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      navigate("/", { replace: true });
      return;
    }

    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          "https://hire-hub-liard.vercel.app/api/jobs/v1/listalljobs",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, [navigate]);

  const uniqueCompanies = [...new Set(companies.map((job) => job.company))];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Companies</h2>
      <ul className="space-y-2">
        {uniqueCompanies.map((company, index) => (
          <li
            key={index}
            className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg shadow-sm"
          >
            {company}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Companies;
