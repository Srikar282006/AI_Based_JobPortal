import React, { useState, useEffect } from "react";
import { FaHand } from "react-icons/fa6";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const JOBS_PER_PAGE = 6;

const JobSkeleton = () => (
  <div className="border rounded-xl p-5 animate-pulse flex justify-between">
    <div className="space-y-3">
      <div className="h-5 w-48 bg-gray-300 rounded"></div>
      <div className="h-4 w-64 bg-gray-200 rounded"></div>
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
    </div>
    <div className="flex gap-4">
      <div className="h-6 w-6 bg-gray-300 rounded"></div>
      <div className="h-6 w-6 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const Herohome = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const id = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:5000/company/job/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!token || !id) {
    return;
  }

  fetchJobs();
}, [token, id]);


  const filteredJobs = jobs.filter((job) =>
    job.job_title.toLowerCase().includes(search.toLowerCase())
  );

  const handledelete = async (jobId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:5000/job/delete/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Job deleted successfully");
      fetchJobs();
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (page - 1) * JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(
    startIndex,
    startIndex + JOBS_PER_PAGE
  );

  return (
    <>
      <div className="bg-green-50 px-6 py-10">
  <div className="max-w-5xl mx-auto flex flex-col items-center text-center">

    {/* GREETING */}
    <div className="flex items-center gap-2 mb-6">
      <h1 className="text-3xl font-semibold">Hi Guest</h1>
      <FaHand
        className="text-yellow-400 transition-transform duration-500 rotate-[45deg] hover:rotate-[-45deg]"
        size={24}
      />
    </div>

    {/* CONTENT */}
    <div className="flex flex-col md:flex-row gap-6 w-full">

      <div className="md:w-1/2">
        <h1 className="text-xl font-semibold">
          Personalized Applicant Recommender Just for Your Job Posting
        </h1>
      </div>

      <div className="md:w-1/2">
        <p className="text-gray-700">
          Our intelligent applicant recommender system analyzes applicant
          skills, experience, and preferences to suggest the best candidates.
        </p>
      </div>

    </div>
  </div>
</div>


      <div className="flex justify-center mt-8">
        <input
          type="search"
          placeholder="Search job postings..."
          className="w-2/3 max-w-md px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black outline-none sm:w-2/3 lg:w-2/3 "
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      
      <div className="flex justify-center mt-8">
        <div className="w-2/3 space-y-4">
          {loading &&
            [...Array(3)].map((_, i) => <JobSkeleton key={i} />)}
{token?<>
{!loading && jobs.length === 0 && (
            <div className="text-center py-12 border rounded-xl bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-700">
                No job posted yet 🚫
              </h2>
              <p className="text-gray-500 mt-2">
                Create your first job posting to get started.
              </p>
            </div>
          )}

 {!loading &&
            currentJobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-xl p-5 shadow-sm flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <h2 className="text-xl font-semibold">{job.job_title}</h2>
                  <p className="text-gray-600 mt-1">
                    Skills: {job.job_skills}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
  <button
    className="text-sm text-blue-600 hover:underline"
    onClick={() => nav(`/details/${job.id}`)}
  >
    View Details
  </button>

  <button
    className="text-sm text-blue-600  hover:underline"
    onClick={() => nav(`/recommend/${job.id}`)}
  >
    Recommend Applicants
  </button>
</div>

                </div>

                <div className="flex gap-4 text-xl">
                  <button
                    className="text-green-600 hover:scale-110 transition"
                    onClick={() => nav(`/job/edit/${job.id}`)}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="text-red-600 hover:scale-110 transition"
                    onClick={() => handledelete(job.id)}
                  >
                    <FiTrash2 />
                  </button>
                  
                </div>
              </div>
            ))}
</>:<>

   <div className="text-center py-12 border rounded-xl bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-700">
                Login First!!!
              </h2>
              <p className="text-gray-500 mt-2">
                Post your job after login.
              </p>
            </div>

</>}
          

         
        </div>
      </div>

      

      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg border ${
                page === i + 1
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default Herohome;
