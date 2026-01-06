import React, { useEffect, useState, useRef } from "react";
import { AiOutlineGlobal } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlinePostAdd } from "react-icons/md";
import Login from "./Login.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const modalRef = useRef(null);
  const nav=useNavigate()
  const token=localStorage.getItem("token")
 const userid=localStorage.getItem("userId")
const data=JSON.parse(localStorage.getItem("userdata"))

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
      "https://ai-based-jobportal-1.onrender.com/company/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userdata");
    localStorage.removeItem("userId");

    toast.success("Logout Successful");

    // reload app cleanly
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
          <a className="pointer mr-5" href="/">Home</a>
          <a className="pointer ml-3 mr-3" href="/jobspost">PostJob<MdOutlinePostAdd  className="inline mb-1" size={23}/></a>
        </div>
        

        {/* Profile + Sign In */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Profile"
                src={ token?`https://ai-based-jobportal-1.onrender.com/uploads/company_logos/${data.logo_file}`:
                  

      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
          </div>

          <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
            <li><a href={`/profile/${userid}`}>Profile</a></li>
            {token==null?<>
            <li><button onClick={()=>{nav("/register")}}>Sign Up</button></li>
            <li><button onClick={handleModal}>Sign in</button></li>
            </>:
          <>
          <li><button onClick={handleLogout}>Logout</button></li>
          
          </>}
          </ul>
        </div>
      </div>

      {/* Modal */}
<dialog ref={modalRef} id="login_modal" className="modal">
  <div className="modal-box relative">

   
    <button
      type="button"
      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
      onClick={closeModal}
    >
      ✕
    </button>

    <Login onClose={closeModal} />
  </div>

  
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>


    </div>
  );
};

export default Navbar;
