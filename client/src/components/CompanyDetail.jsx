import React, { useEffect, useState } from 'react'
import { useParams, useNavigate,Link } from 'react-router-dom'
import axios from 'axios'
import { FaArrowLeft } from "react-icons/fa6"
import companyPlaceholder from '../assets/image.png'
import { toast } from "react-toastify";
import companylogo from '../assets/unknowncompany.jpg'
import { useRef } from "react";

const CompanyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [appliedJobs, setAppliedJobs] = useState([]);
  const userdetail=JSON.parse(localStorage.getItem("UserDetail"))
  const toastShown = useRef(false);

  const handlegetbyid = async () => {
    try {
      const res = await axios.get(`https://ai-based-jobportal-1.onrender.com/job/get/${id}`)
      setData(res.data)
      console.log(res.data.company_logo)
      console.log(res.data.company_logo.split("/uploads/company_logos"))

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
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
      { },
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


const getAppliedJobs = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get("https://ai-based-jobportal-1.onrender.com/users/applied", {
      headers: { Authorization: `Bearer ${token}` }
    });


    setAppliedJobs(res.data.applied_job_ids);

    console.log("Applied Jobs Loaded:", res.data.applied_job_ids);

  } catch (error) {
    console.log("Error fetching applied jobs:", error);
  }
};

  useEffect(() => {
    
    if (!id) return
    handlegetbyid()
    getAppliedJobs();
  }, [id])

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    )

  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Job not found!</p>
      </div>
    )

  return (
    <div className="min-h-screen  p-4 sm:p-6 md:p-10">
      {/* Back Button */}
      <Link to="/"
        className="flex items-center gap-2 text-gray-700 hover:text-black mb-6 font-semibold"
      >
        <FaArrowLeft /> Back
      </Link>

      {/* Company Section */}
      <section className=" p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
  src={
    data.company_logo && data.company_logo.startsWith("https")
      ? data.company_logo.split("/uploads/company_logos")[0] +
        "/uploads/company_logos/" +
        data.company_logo.split("/uploads/company_logos")[2]
      : companyPlaceholder
  }
  alt={data.company_name}
  className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-xl border"
  onError={(e) => {
      e.currentTarget.src = companylogo}}
/>


          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{data.company_name}</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">{data.about_company}</p>
          </div>
        </div>
      </section>

      {/* Job Description Section */}
      <section className=" p-6 md:p-8 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Job Description</h2>
        <p className="text-gray-700 text-sm md:text-base">{data.job_detail.job_description}</p>
      </section>

      {/* Skills Section */}
      <section className=" p-6 md:p-8 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Required Skills</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.job_detail.job_skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm md:text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Applicants Section */}
      <section className="p-6 md:p-8 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Applicants</h2>
        <p className="text-gray-700 text-sm md:text-base">
          Total Applicants: <span className="font-semibold">{data.job_detail.applicants.length}</span>
        </p>
      </section>

      {/* Apply Section */}
     
<section className="p-6 md:p-8 mb-6 text-center">
  <button
    className={`btn w-1/3 ${
      appliedJobs.includes(data.id)
        ? "btn-disabled bg-gray-400 text-black"
        : "btn-primary"
    }`}
   onClick={() => handleApplyJob(data.job_detail.id)}
disabled={appliedJobs.includes(data.job_detail.id)}
>
  {appliedJobs.includes(data.job_detail.id)
    ? "Already Applied"
    : "Apply Now"}

  </button>
</section>


    </div>
  )
}

export default CompanyDetail
