import React, { useEffect, useState, useRef } from "react";
import { AiOutlineGlobal } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import Login from "./Login.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [language, setLanguage] = useState("English");
  const modalRef = useRef(null);
  const nav=useNavigate()
  const [token,setToken]=useState(localStorage.getItem("token"))
 const userid=localStorage.getItem("Userid")
 const userprofile = localStorage.getItem("userprofile");

  useEffect(() => {
  const storedToken = localStorage.getItem("token");
  setToken(storedToken);
}, []);


  const handleModal = () => {
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

 
  
const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    await axios.post(
      "https://ai-based-jobportal-1.onrender.com/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  } catch (error) {
    console.error("Logout error:", error.response?.data);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("Userid");
    localStorage.removeItem("Language");
    localStorage.removeItem("UserDetail");
    localStorage.removeItem("Userdata");
    localStorage.removeItem("userprofile");
    setToken(null);

    toast.success("Logout Successful");
    window.location.href = "/";
  }
};


  return (
    <div className="navbar bg-base-100 shadow-sm px-4 justify-between w-full fixed top-0 left-0 right-0 z-50">
      <div className="flex-1">
        <a className="text-xl font-semibold">Joblapper</a>
      </div>

      <div className="flex gap-4 items-center">
        <div className="font-semibold">
          <a className="pointer mr-4" href="/">Home</a>
          <a className="pointer" href="/recommender">Recommender</a>
        </div>

        {/* Profile + Sign In */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Profile"
                src={
                   userprofile
      ? `https://ai-based-jobportal-1.onrender.com/${userprofile}`
      : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
          </div>

          <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
            <li><a href={`/profile`}>Profile</a></li>
            {token===null?<>
            <li><button onClick={()=>{nav("/register")}}>Sign Up</button></li>
            <li><button onClick={handleModal}>Sign in</button></li>
            </>:
          <>
          <li><button onClick={()=>{nav(`/job/applied/${userid}`)}}>Applied Jobs</button></li>
          <li><button onClick={handleLogout}>Logout</button></li>
          
          </>}
          </ul>
        </div>
      </div>

      {/* Modal */}
    {/* Modal */}
<dialog ref={modalRef} id="login_modal" className="modal">
  <div className="modal-box relative">

    {/* Close button */}
    <button
      type="button"
      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
      onClick={closeModal}
    >
      ✕
    </button>

    <Login onClose={closeModal} />
  </div>

  {/* REQUIRED BACKDROP - this was missing */}
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>


    </div>
  );
};

export default Navbar;
