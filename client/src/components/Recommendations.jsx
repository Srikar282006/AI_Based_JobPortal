import React, { useState } from 'react'
import axios from 'axios'
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import companylogo from '../assets/unknowncompany.jpg'
const Recommendations = () => {
  const nav=useNavigate("/")
  const userid = localStorage.getItem("Userid")
  const token = localStorage.getItem("token")

  const [rjobs, setRjobs] = useState([])

  const handlerecommend = async () => {
    try {
      const data = await axios.get(
        `https://ai-based-jobportal-1.onrender.com/recommend/userjobs/${userid}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
       if (data.status === 404) {
    toast.warning("Some details are missing, please enter your information.");
   nav("/profile")
  }

      setRjobs(data.data)

    } catch (error) {
      toast.error("Failed to fetch recommendations")
    }
  }

const handleApplyJob = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    const res = await axios.post(
      `https://ai-based-jobportal-1.onrender.com/users/job/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(res.data.message);

    // ✅ FIX: update applied status in rjobs
    setRjobs((prev) =>
      prev.map((job) =>
        job.job_id === id ? { ...job, applied: true } : job
      )
    );

  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message);

      if (error.response.data.message === "Already applied for this job") {
        // still mark as applied
        setRjobs((prev) =>
          prev.map((job) =>
            job.job_id === id ? { ...job, applied: true } : job
          )
        );
      }
    } else {
      toast.error("Something went wrong");
    }
  }
};


  return (
    <>
      
      <div className="flex flex-col items-center justify-center text-center py-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Find Your Next Job Faster
        </h1>
        <p className="text-gray-600 sm:text-lg md:text-xl mb-8 max-w-2xl">
          Get AI-powered job recommendations tailored to your skills and experience.
        </p>
        <button
          onClick={handlerecommend}
          className="px-8 py-4 bg-blue-600 text-white text-lg rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transform transition-all duration-300"
        >
          Get AI Recommendations
        </button>
      </div>

      {/* Center Wrapper */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px"
        }}
      >
        {/* Cards Container */}
        <div
          style={{
            width: "75%",
            maxWidth: "1000px",
            display: "grid",
            gap: "20px"
          }}
        >
          {rjobs.slice(0, 10).map((job) => {

            const isApplied = job?.applied || false

            return (
              <div
                key={job.job_id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  backgroundColor: "#fff"
                }}
              >
                {/* Company Logo */}
                <img
  src={job.company.logo_url}
  alt={job.company.company_name}
  className="w-[80px] h-[80px] object-cover rounded-[10px] border border-gray-200"
  onError={(e) => {
        e.currentTarget.src = companylogo}}
/>


                {/* Job Info */}
                <div style={{ flex: 1 }}>

                  <h3 style={{ margin: "0 0 6px 0" }}>
                    {job.job_title}
                  </h3>

                  <p style={{ margin: "0 0 6px 0", color: "#555" }}>
                    {job.company.company_name}
                  </p>

                  <p style={{ fontSize: "14px", marginBottom: "6px" }}>
                    <strong>Required Skills:</strong> {job.job_skills}
                  </p>

                </div>

                {/* Buttons */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    minWidth: "160px"
                  }}
                  
                >
                  <button
                    style={{
                      padding: "10px",
                      backgroundColor: "#000",
                      color: "#fff",
                      borderRadius: "6px"
                    }}
                    onClick={() => nav(`/jobdetail/apply/${job.job_id}`)}
                  >
                    View Details
                  </button>

                  <button
                    disabled={isApplied}
                    onClick={()=>{handleApplyJob(job.job_id)}}
                    style={{
                      padding: "10px",
                      backgroundColor: isApplied ? "#9ca3af" : "#1d4ed8",
                      color: "#fff",
                      borderRadius: "6px",
                      cursor: isApplied ? "not-allowed" : "pointer"
                    }}
                  >
                    {isApplied ? "Applied" : "Apply Now"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Recommendations
