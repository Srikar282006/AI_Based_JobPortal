import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";

const Profile = () => {
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("userId");

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    company_email: "",
    about_company: "",
    website: "",
    logo_file: null,
    logo_preview: "",
  });

  /* ================= FETCH PROFILE (FRESH DATA) ================= */
  useEffect(() => {
    

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:5000/company/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const company = res.data.company;

        setFormData({
          company_name: company.company_name || "",
          company_email: company.company_email || "",
          about_company: company.about_company || "",
          website: company.website || "",
          logo_file: null,
          logo_preview: company.logo_file
            ? `http://127.0.0.1:5000/uploads/company_logos/${company.logo_file}`
            : "",
        });

        // keep localStorage in sync
        localStorage.setItem("userdata", JSON.stringify(company));
        console.log(company.logo_file)
      } catch {
        toast.error("Failed to load company profile");
      }
    };

    fetchProfile();
  }, [token]);

  /* ================= INPUT HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
   
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({
      ...formData,
      logo_file: file,
      logo_preview: URL.createObjectURL(file),
    });
  };

  /* ================= UPDATE PROFILE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("company_name", formData.company_name);
      fd.append("about_company", formData.about_company);
      fd.append("website", formData.website);
      if (formData.logo_file) {
        fd.append("logo_file", formData.logo_file);
      }

      const res = await axios.put(
        `http://127.0.0.1:5000/edit/company/${companyId}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully");

      localStorage.setItem(
        "userdata",
        JSON.stringify(res.data.company)
      );

      setEditMode(false);
      nav("/")
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="flex justify-center mt-10">
      <div className="w-2/3 bg-white border rounded-xl p-8 shadow-sm mb-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => nav(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <FiArrowLeft /> Back
          </button>

          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              <FiEdit2 /> Edit Profile
            </button>
          )}
        </div>

        <h1 className="text-2xl font-semibold text-center mb-8">
          Company Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* LOGO */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-28 w-28 rounded-full border flex items-center justify-center overflow-hidden">
              {formData.logo_preview ? (
                <img
                  src={formData.logo_preview}
                  alt="Company Logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Logo</span>
              )}
            </div>

            {editMode && (
              <>
                <label
                  htmlFor="logoUpload"
                  className="px-4 py-2 text-sm bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  Change Logo
                </label>
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* COMPANY NAME */}
          <div>
            <label className="block mb-1 font-medium">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              disabled={!editMode}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          {/* WEBSITE */}
          <div>
            <label className="block mb-1 font-medium">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              disabled={!editMode}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          {/* ABOUT */}
          <div>
            <label className="block mb-1 font-medium">About Company</label>
            <textarea
              name="about_company"
              value={formData.about_company}
              disabled={!editMode}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-3 border rounded-lg resize-none disabled:bg-gray-100"
            />
          </div>

          {/* ACTION BUTTONS */}
          {editMode && (
            <div className="flex justify-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-8 py-3 border rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
