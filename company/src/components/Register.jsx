import React, { useState } from "react";
import axios from "axios"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [companyname, setCompanyname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [about, setAbout] = useState("");
  const [web, setWeb] = useState("");
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const nav=useNavigate("/")

  // company_name = request.form.get("company_name")
  //   company_email = request.form.get("company_email")
  //   about_company = request.form.get("about_company")
  //   password = request.form.get("password")
  //   website = request.form.get("website")
  //   file = request.files.get("logo_file")
  // Validation function
const validate = () => {
  const newErrors = {};

  if (!companyname.trim())
    newErrors.companyname = "Company name is required";

  if (!email.trim())
    newErrors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(email))
    newErrors.email = "Enter a valid email";

  if (!about.trim())
    newErrors.about = "About company is required";

  if (!password.trim())
    newErrors.password = "Password is required";
  else if (password.length < 6)
    newErrors.password = "Password must be at least 6 characters";

  if (!file)
    newErrors.file = "Company logo is required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoader(true);

    const formData = new FormData();
    formData.append("company_name", companyname);
    formData.append("company_email", email);
    formData.append("about_company", about);
    formData.append("password", password);
    formData.append("website", web);
    formData.append("file", file);

    // submit logic 
  const data=await axios.post("https://ai-based-jobportal-1.onrender.com/register/company",
    formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
  )
  setLoader(false)
      toast.success("Registration Successful!",{
         position: "top-right",
            autoClose: 2000,
      })
      console.log(data)

    setTimeout(() => {
      setLoader(false);
    }, 1500);
    nav("/");
    localStorage.setItem("token",data.data.token)
    localStorage.setItem("userdata",data.data.userdata)
    localStorage.setItem("userId",data.data.userdata.id)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Company Registration
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={companyname}
              onChange={(e) => setCompanyname(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            />
            {errors.companyname && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyname}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* About */}
          <div>
            <label className="block text-sm font-medium mb-1">
              About Company
            </label>
            <textarea
              rows="3"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-black outline-none"
            />
            {errors.about && (
              <p className="text-red-500 text-xs mt-1">{errors.about}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="url"
              value={web}
              onChange={(e) => setWeb(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* File */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Logo
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm"
            />
            {errors.file && (
              <p className="text-red-500 text-xs mt-1">{errors.file}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loader}
            className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition flex justify-center items-center gap-2"
          >
            {loader && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
