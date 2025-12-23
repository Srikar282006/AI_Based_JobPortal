import React, { useState, useEffect,useRef } from 'react'
import { FaHand } from "react-icons/fa6";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import companylogo from '../assets/unknowncompany.jpg'

const HomeHero = () => {
  const [jobslist, setJobslist] = useState([]);
  const userdetail = JSON.parse(localStorage.getItem("UserDetail"));
  const nav = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token=localStorage.getItem("token")
  const usernam=localStorage.getItem("userdata")
  const didRun = useRef(false);

  // Fetch all jobs
  const getjobs = async () => {
    try {
      const resp = await axios.get("http://127.0.0.1:5000/job/getall");
      setJobslist(resp.data.data);
      console.log("Fetched jobs:", resp.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch applied jobs
  const getAppliedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://127.0.0.1:5000/users/applied", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppliedJobs(res.data.applied_job_ids);
      console.log("Applied Jobs Loaded:", res.data.applied_job_ids);

    } catch (error) {
      console.log("Error fetching applied jobs:", error);
    }
  };

useEffect(() => {
  if (didRun.current) return;
  didRun.current = true;

  getjobs();
  getAppliedJobs();

}, []);

  const handleCompany = (id) => {
    nav(`/jobdetail/apply/${id}`);
  };

  const handleApplyJob = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const res = await axios.post(
        `http://127.0.0.1:5000/users/job/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      setAppliedJobs((prev) => [...prev, id]);

    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);

        if (error.response.data.message === "Already applied for this job") {
          setAppliedJobs((prev) => [...prev, id]);
        }
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // SEARCH FILTERING
  const filteredJobs = jobslist.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.job_title.toLowerCase().includes(term) ||
      job.company_name.toLowerCase().includes(term) ||
      job.job_skills.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <div className="bg-green-50 px-4 py-10">
  <div className="max-w-5xl mx-auto text-center space-y-6">

    {/* Greeting */}
    <div className="flex justify-center items-center gap-3">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
        Hi {userdetail?.username || "Guest"}
      </h1>
      <FaHand
        className="text-yellow-400 transition-transform duration-500 rotate-[20deg] hover:rotate-[-20deg]"
        size={26}
      />
    </div>

    {/* Subtitle */}
    <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
      Personalized Job Recommendations Just for You
    </h2>

    {/* Description */}
    <p className="max-w-3xl mx-auto text-gray-600 text-base md:text-lg leading-relaxed">
      Our intelligent job recommender system analyzes your skills, experience,
      and preferences to suggest the best opportunities tailored specifically
      to your career goals.
    </p>

  </div>
</div>


      {/* SEARCH BAR */}
      <h1 className='text-3xl text-center font-semibold mt-5'>Find your Job</h1>

      <div className="flex items-center space-x-2 w-full max-w-md mx-auto mt-10">
        <label className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>

          <input
            type="search"
            placeholder="Search jobs, skills, companies..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>

        <button
          className="bg-black text-white font-semibold px-5 py-3 rounded-lg shadow-md hover:bg-gray-700">
          Search
        </button>
      </div>

      {/* JOB LIST */}
      <div className="mt-5 py-11 px-4">
        <div className="flex flex-col items-center gap-6">

          {filteredJobs.length === 0 ? (
            <p className="text-gray-500 text-lg">No jobs found.</p>
          ) : (
            filteredJobs.map((e) => 
              (
              
              <div
                key={e.id}
                className="border border-gray-300 rounded-xl w-full max-w-3xl p-4 shadow-sm hover:border-black"
              >
                {/* Top */}
                <div className="flex items-center gap-4">
                  <img
  src={e.company_logo || companylogo}
  alt="company logo"
  className="rounded-xl w-14 h-14 md:w-16 md:h-16 object-cover"
  onError={(e) => {
    e.currentTarget.src = companylogo
  }}
/>
                  <div>
                    <h1
                      className="text-xl md:text-2xl font-semibold hover:underline cursor-pointer"
                      onClick={() => nav(`/jobdetail/apply/${e.id}`)}
                    >
                      {e.job_title}
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base">
                      {e.company_name}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-4">
                  <p className="font-bold text-sm md:text-base">Required Skills:</p>
                  <p className="font-medium text-gray-700 break-words md:ml-2 text-sm md:text-base">
                    {e.job_skills}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-row justify-between gap-4 mt-5">
                  <button
                    className="btn btn-neutral w-1/2"
                    onClick={() => nav(`/jobdetail/apply/${e.id}`)}
                  >
                    View Details
                  </button>

                  <button
                    className={`btn w-1/3 ${
                      appliedJobs.includes(e.id)
                        ? "btn-disabled bg-gray-400 text-white"
                        : "btn-primary"
                    }`}
                    onClick={() => handleApplyJob(e.id)}
                    disabled={appliedJobs.includes(e.id)}
                  >
                    {appliedJobs.includes(e.id) ? "Already Applied" : "Apply Now"}
                  </button>
                </div>

              </div>
            ))
          )}

        </div>
       
      </div>
    </>
  );
};

export default HomeHero;
