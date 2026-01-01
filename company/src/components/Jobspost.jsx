import React, { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Jobspost = () => {
  const [formData, setFormData] = useState({
    job_title: "",
    job_skills: "",
    job_description: "",
  });
  const nav=useNavigate()

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("userId");

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };




const handleSubmit = async (e) => {
  e.preventDefault();

  if (!token) {
    toast.error("Please login first");

    setTimeout(() => {
      
    }, 500);

    return;
  }

  if (
    !formData.job_title ||
    !formData.job_skills ||
    !formData.job_description
  ) {
    toast.error("All fields are required");
    return;
  }

  try {
    setLoading(true);

    await axios.post(
      "https://ai-based-jobportal-1.onrender.com/jobs/post",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Job posted successfully ");

    setFormData({
      job_title: "",
      job_skills: "",
      job_description: "",
    });

    nav("/");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to post job");
  } finally {
    setLoading(false);
  }
};





  return (
    <>
      <div className="flex justify-center mt-12">
        <div className="w-2/3 border rounded-xl p-8 shadow-sm bg-white">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Create Job Posting
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* JOB TITLE */}
            <div>
              <label className="block mb-2 font-medium">Job Title</label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            {/* JOB SKILLS */}
            <div>
              <label className="block mb-2 font-medium">
                Required Skills
              </label>
              <input
                type="text"
                name="job_skills"
                value={formData.job_skills}
                onChange={handleChange}
                placeholder="e.g. React, Tailwind, JavaScript"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate skills with commas
              </p>
            </div>

            {/* JOB DESCRIPTION */}
            <div>
              <label className="block mb-2 font-medium">
                Job Description
              </label>
              <textarea
                name="job_description"
                value={formData.job_description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the job role and responsibilities"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black outline-none resize-none"
              ></textarea>
            </div>

            {/* SUBMIT */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-lg text-white font-semibold ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {loading ? "Posting..." : "Post Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Jobspost;
