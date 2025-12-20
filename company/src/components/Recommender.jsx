import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";

const ITEMS_PER_PAGE = 5;

const Recommender = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [jobTitle, setJobTitle] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   
    const fetchData = async () => {
      try {
        setLoading(true);

        const jobRes = await axios.get(
          `http://127.0.0.1:5000/job/get/${jobId}`
        );
        setJobTitle(jobRes.data.job_detail.job_title);

        const recRes = await axios.get(
          `http://127.0.0.1:5000/recommend/topapplicants/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setApplicants(Array.isArray(recRes.data) ? recRes.data : []);
      } catch {
        toast.error("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, token, navigate]);

  /* Pagination */
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedApplicants = applicants.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(applicants.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 ">
      <div className="max-w-5xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-6"
        >
          <FiArrowLeft /> Back
        </button>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-2">
          {jobTitle}
        </h1>

        <h2 className="text-center text-gray-600 mb-10">
          Top Recommended Applicants
        </h2>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-400">Loading recommendations…</p>
        )}

        {/* APPLICANTS */}
        {/* APPLICANTS */}
{!loading && applicants.length === 0 ? (
  <div className="text-center py-20">
    <p className="text-gray-400 text-lg">
      No applicants found
    </p>
  </div>
) : (
  <div className="space-y-8">
    {paginatedApplicants.map((app, index) => (
      <div
        key={index}
        className="flex gap-6 items-start bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
      >
        {/* AVATAR */}
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            alt="Applicant"
            className="h-full w-full object-cover"
          />
        </div>

        {/* INFO */}
        <div className="flex-1 space-y-1">
          <p className="font-semibold text-lg">
            Applicant #{app.applicant_id}
          </p>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Skills:</span> {app.skills}
          </p>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Education:</span> {app.education}
          </p>

          <p className="text-sm mt-2">
            Match Score{" "}
            <span className="font-semibold text-green-600">
              {Math.round(app.similarity * 100)}%
            </span>
          </p>
        </div>

        {/* ACTION */}
        <a
          href={`http://127.0.0.1:5000/${app.resume}`}
          target="_blank"
          rel="noreferrer"
          className="self-center px-5 py-2 text-sm rounded-full bg-black text-white hover:bg-gray-800 transition"
        >
          View Resume
        </a>
      </div>
    ))}
  </div>
)}


        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="text-sm px-4 py-2 rounded-full border disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="text-sm px-4 py-2 rounded-full border disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommender;
