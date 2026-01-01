import React, { useState } from "react";
import axios from "axios"
import {useNavigate} from "react-router-dom"
import { toast } from "react-toastify";

const Register = () => {
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [filename,setFilename]=useState("")
    const [loader,setLoader]=useState(false)
    
    const Language="English"
  const nav=useNavigate()
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoader(true);

  try {
    const payload = {
      username: username,
      email: email,
      password: password,
      language: Language,
      image_file: filename || null   // optional: just send filename string
    };

    const response = await axios.post(
      "https://ai-based-jobportal-1.onrender.com/register",
      payload,
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    setLoader(false);

    toast.success("Registration Successful!", {
      position: "top-right",
      autoClose: 2000,
    });

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("UserData", JSON.stringify(response.data.userdata));
    localStorage.setItem("userprofile", response.data.userdata.image_file);

    nav("/");
    console.log("Submitted Details");
    console.log(response.data, password);

  } catch (error) {
    setLoader(false);
    toast.error(error.response?.data?.message || "Registration failed");
    console.error("Error submitting:", error);
  }
};



  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Create Account
          </h1>

          {/* Username */}
          <div className="mb-1">
            <label className="text-gray-700 font-semibold">Username :</label>
            <label className="input validator mt-1">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
                type="text"
                required
                placeholder="Username"
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength="3"
                maxLength="30"
                title="Only letters, numbers or dash"
                onChange={(e)=>{setUsername(e.target.value)}}
              />
            </label>
          </div>

          {/* Email */}
          <div className="mb-2">
            <label className="text-gray-700 font-semibold block">Email :</label>
            <label className="input validator mt-1">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input type="email" placeholder="mail@site.com" onChange={(e)=>{setEmail(e.target.value)}} required />
            </label>
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="text-gray-700 font-semibold">Password :</label>
            <label className="input validator mt-1">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input
                type="password"
                required
                placeholder="Password"
                minLength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="At least 8 chars, 1 number, 1 lowercase, 1 uppercase"
                onChange={(e)=>{setPassword(e.target.value)}}
              />
            </label>
          </div>

          {/* File Upload */}
          <div className="mb-2">
            <label className="text-gray-700 font-semibold">Profile Picture :</label>
            <fieldset className="fieldset mt-2">
              <input type="file" className="file-input" onChange={(e)=>{setFilename(e.target.files[0])}}/>
              <label className="label">Max size 2MB</label>
            </fieldset>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl mt-3 text-lg font-semibold transition-all shadow-md"
           >
           {loader && <span className="loading loading-spinner loading-xl"></span>} Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;