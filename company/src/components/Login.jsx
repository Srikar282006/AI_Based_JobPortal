import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"
const Login = ({ onClose }) => {

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [loader,setLoader]=useState(false)
 const nav=useNavigate()

 
const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
  toast.error("Email and password are required");
  return;
}

if (password.length < 8) {
  toast.error("Password must be at least 8 characters");
  return;
}

setLoader(true);


  try {
    const response = await axios.post(
      "https://ai-based-jobportal-1.onrender.com/company/login",
      {
        company_email:email,
        password,
      },
      {
        headers: { "Content-Type": "application/json" } // JSON
      }
    );

    setLoader(false);
  console.log(response.data)
    onClose();  // close modal
    nav("/")
    window.location.reload();
    console.log(response)
    localStorage.setItem("token",response.data.token)
    localStorage.setItem("userdata",JSON.stringify(response.data.userdata))
    localStorage.setItem("userId",response.data.userdata.id)
    

  } catch (error) {
    setLoader(false);
    toast.error(error.response?.data?.error || "Login failed!");
    console.error("Error:", error);
  }
};



  return (
    <div className="flex flex-col items-center">
      <form className="  p-8 w-full max-w-md relative" onSubmit={handleLogin}>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Please Login</h1>

          {/* Close button - closes modal */}
        </div>

        {/* Email */}
        <div className="mb-4 px-1">
          <h1 className="font-medium text-md mb-1">Email</h1>

          <label className="input validator flex items-center gap-2">
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
            <input
              type="email"
              placeholder="mail@site.com"
              className="w-full outline-none"
              onChange={(e)=>{
                setEmail(e.target.value)
              }}
              required
            />
          </label>
        </div>

        {/* Password */}
        <div className="mb-4 px-1">
          <h1 className="font-medium text-md mb-1">Password</h1>

          <label className="input validator flex items-center gap-2">
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
              placeholder="Password"
              required
              minLength="8"
              className="w-full outline-none"
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
            />
          </label>
        </div>

        <p className="text-2xs">Do you have an Accout? <a href="/register" className="text-blue-700 hover:underline">Register</a></p>
        {/* Submit */}
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl mt-3 text-lg font-semibold transition-all shadow-md"
        >
          {loader && <span className="loading loading-spinner loading-xl"></span>} Sign In
        </button>
        
      </form>
    </div>
  );
};

export default Login;
