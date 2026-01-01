import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";


const Editjob = () => {
  const [data, setData] = useState({
    job_title: "",
    job_skills: "",
    job_description: "",
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();

  /* ----------- GET JOB DATA (UNCHANGED LOGIC) ----------- */
  const handlegetdata = async () => {
    try {
      const res = await axios.get(
        `https://ai-based-jobportal-1.onrender.com/job/get/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(res.data.job_detail || []);
      toast.success("Data Retrieved Successfully");

      setData(res.data.job_detail);
      
    } catch (error) {
      toast.error("Failed to fetch job data");
    }
  };

  useEffect(() => {
    if (!token) {
  toast.error("Please login first");
  navigate("/");
  return;
}


    handlegetdata();
  }, []);

  /* ----------- HANDLE CHANGE ----------- */
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  /* ----------- UPDATE JOB ----------- */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!data.job_title || !data.job_skills || !data.job_description) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `https://ai-based-jobportal-1.onrender.com/job/edit/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Job updated successfully");
      navigate(-1); // go back
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-12">
        <div className="w-2/3 bg-white border rounded-xl p-8 shadow-sm">
          <div className="flex items-center mb-6">
  <button
    onClick={() => navigate(-1)}
    className="mr-3 p-2 rounded-full hover:bg-gray-100 transition"
  >
    <FaArrowLeft size={18} />
  </button>

  <h1 className="text-2xl font-semibold flex-1 text-center">
    Edit Job Posting
  </h1>
</div>


          <form onSubmit={handleUpdate} className="space-y-6">
            {/* JOB TITLE */}
            <div>
              <label className="block mb-2 font-medium">Job Title</label>
              <input
                type="text"
                name="job_title"
                value={data.job_title}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            {/* JOB SKILLS */}
            <div>
              <label className="block mb-2 font-medium">Required Skills</label>
              <input
                type="text"
                name="job_skills"
                value={data.job_skills}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate skills with commas
              </p>
            </div>

            {/* JOB DESCRIPTION */}
            <div>
              <label className="block mb-2 font-medium">Job Description</label>
              <textarea
                name="job_description"
                rows="5"
                value={data.job_description}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black outline-none resize-none"
              ></textarea>
            </div>

            {/* BUTTON */}
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
                {loading ? "Updating..." : "Update Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Editjob;
