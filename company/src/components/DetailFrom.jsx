import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";

const DetailForm = () => {
  const token = localStorage.getItem("token");
  const { jobid } = useParams();
    const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH JOB DETAILS ---------------- */
  const handleJobData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:5000/job/get/${jobid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJob(res.data.job_detail);
    } catch (error) {
      toast.error("Failed to fetch job data");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH APPLICANTS ---------------- */
  const handleApplicants = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/job/applicant/${jobid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplicants(res.data.applicants || []);
    } catch (error) {
      toast.error("Failed to fetch applicants");
    }
  };

  useEffect(() => {
   

    handleJobData();
    handleApplicants();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg font-semibold">
        Loading job details...
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
        <button
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
>
  <FiArrowLeft size={20} />
  <span className="text-sm font-medium">Back</span>
</button>


      <h1 className="text-3xl font-bold text-center mb-6">
        {job.job_title}
      </h1>

      <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mb-8">
        {job.job_description}
      </p>


      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {job.job_skills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-1 bg-gray-200 text-sm rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>


      <h2 className="text-2xl font-semibold text-center mb-8">
        Applied Candidates
      </h2>


      {applicants.length === 0 && (
        <p className="text-center text-gray-500">
          No applicants have applied yet.
        </p>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
        {applicants.map((applicant, index) => (
          <div
            key={index}
            className="border rounded-xl p-6 shadow-sm hover:shadow-md transition w-full max-w-md"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <img
                src={
                  applicant.profile_image ||
                  "https://via.placeholder.com/80"
                }
                alt="profile"
                className="w-16 h-16 rounded-full object-cover border"
              />

              <h3 className="font-semibold text-lg">
                {applicant.name}
              </h3>

              <p className="text-sm text-gray-500">
                {applicant.email}
              </p>

              {/* SKILLS */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
               {Array.isArray(applicant.skills)
  ? applicant.skills.map((skill, i) => (
      <span
        key={i}
        className="px-3 py-1 text-xs bg-gray-100 rounded-full"
      >
        {skill}
      </span>
    ))
  : applicant.skills
      ?.split(",")
      .map((skill, i) => (
        <span
          key={i}
          className="px-3 py-1 text-xs bg-gray-100 rounded-full"
        >
          {skill.trim()}
        </span>
      ))}

              </div>

         
              {applicant.resume && (
                <a
                  href={applicant.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm mt-3 hover:underline"
                >
                  View Resume
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailForm;
