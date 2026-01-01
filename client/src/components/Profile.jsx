import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const UserDetails = () => {
  const [skills, setSkills] = useState("");
  const [cover, setCover] = useState("");
  const [education, setEducation] = useState("");
  const [filename, setFilename] = useState(null);
  const [resumePath, setResumePath] = useState(null);
  const [loader, setLoader] = useState(false);
  const [userDataId, setUserDataId] = useState(null);

  const nav = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      nav("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://ai-based-jobportal-1.onrender.com/user/data/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data.user_data;

        if (data) {
          setSkills(data.skills || "");
          setCover(data.cover_details || "");
          setEducation(data.education || "");
          setUserDataId(data.id);
          setResumePath(data.resume_file || null);
        }
      } catch (error) {
        toast.error("Unable to fetch user details");
      }
    };

    fetchData();
  }, [token, nav]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoader(true);

  try {
    let resumeFileToSend = resumePath;

    // 🔼 If user uploaded new resume during edit → upload first
    if (filename) {
      const fd = new FormData();
      fd.append("resume_file", filename);

      const uploadRes = await axios.post(
        "https://ai-based-jobportal-1.onrender.com/upload-resume",
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      resumeFileToSend = uploadRes.data.file_path;
    }

    // ===========================
    //  EDIT → SEND JSON
    // ===========================
    if (userDataId) {
      await axios.put(
        "https://ai-based-jobportal-1.onrender.com/userdata/edit",
        {
          skills: skills,
          cover_details: cover,
          education: education,
          resume_file: resumeFileToSend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      toast.success("Updated Successfully!");
    }

    // ===========================
    //  FIRST TIME SAVE → FORM DATA
    // ===========================
    else {
      const formData = new FormData();
      formData.append("skills", skills);
      formData.append("cover_details", cover);
      formData.append("education", education);
      if (filename) formData.append("resume_file", filename);

      const response = await axios.post(
        "https://ai-based-jobportal-1.onrender.com/user/data",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setUserDataId(response.data.data.id);
      setResumePath(response.data.data.resume_file);
      toast.success("Saved Successfully!");
    }

    nav("/");
  } catch (error) {
    toast.error(error.response?.data?.error || "Error saving data");
  }

  setLoader(false);
};

  return (
    <>
      <div className="ml-5 mt-10">
        <Link to="/">
          <FaArrowLeft size={20} />
        </Link>
      </div>

      <div className="flex flex-col items-center mt-6 px-4">
        <form className="p-8 w-full max-w-md" onSubmit={handleSubmit}>
          <div className="w-full max-w-xl p-6 space-y-5">
            <h1 className="text-2xl font-semibold text-gray-700 text-center">
              {userDataId ? "Edit your Details" : "Enter your Deatils"}
            </h1>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Skills
              </label>
              <textarea
                className="textarea textarea-bordered w-full resize-none textarea-neutral"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Python, SQL..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Cover Letter
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-32 resize-none textarea-neutral"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="Write about yourself..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Education
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-28 resize-none textarea-neutral"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="ABC University, B.Tech - Computer Science"
              />
            </div>

            {/* ✅ RESUME SECTION */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Resume Upload
              </label>

              {resumePath && (
                <a
                  href={`http://127.0.0.1:5000/${resumePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm mb-1"
                >
                  {resumePath.split("/").pop()}
                </a>
              )}

              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setFilename(e.target.files[0])}
              />
            </div>

            <button
              disabled={loader}
              className={`btn w-full mt-3 ${
                userDataId ? "btn-accent" : "btn-primary"
              }`}
            >
              {loader ? (
                <span className="loading loading-spinner"></span>
              ) : userDataId ? (
                "Update Details"
              ) : (
                "Save Details"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserDetails;
