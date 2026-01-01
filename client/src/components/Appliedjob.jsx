import React, { useEffect, useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from 'axios';
import companylogo from '../assets/unknowncompany.jpg'

const Appliedjob = () => {
 const [appliedjob,setAppliedjob]=useState([])
 const { id }=useParams()
const nav=useNavigate()
const token = localStorage.getItem("token");

const getAppliedJobs = async () => {
  try {
    
    if (!token) return;

    const res = await axios.get("https://ai-based-jobportal-1.onrender.com/users/applied", {
      headers: { Authorization: `Bearer ${token}` }
    });


    setAppliedjob(res.data.applied_jobs);

    console.log("Applied Jobs Loaded:",appliedjob);
    toast.success("Applied Jobs Retrived")

  } catch (error) {
    console.log("Error fetching applied jobs:", error);
  }
};

useEffect(()=>{
   if (!token) {
    toast.error("Please login first");

    setTimeout(() => {
      
    }, 500);

    return;
  }
 getAppliedJobs()
 
},[])

console.log(appliedjob)
  return (
     <>
     <div>
     <h1 className='text-center text-xl font-semibold'>Applied Jobs</h1>
     <p className='text-center text-shadow-gray-400'>List of your job you applied for</p>
     
     <div className='flex flex-col items-center'>
        {appliedjob.length === 0 ? (
          <p className="text-center">No applied jobs found</p>
        ) : (
          appliedjob.map((e, i) => (
            <div
                            key={e.id} 
                            className="border border-gray-300 rounded-xl w-2/3 max-w-3xl p-4 mt-5 shadow-sm hover:border-black bg-gray-100 mb-7"
                          >
                            {/* Top */}
                            <div className="flex items-center gap-15 ">
                              <img
                                src={
  e.company.logo_file
    ? `http://127.0.0.1:5000/uploads/company_logos/${e.company.logo_file}`
    : companylogo
}
onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = companylogo;
  }}

                                alt="company logo"
                                className="rounded-xl w-14 h-14 md:w-16 md:h-16 object-contain"
                              />
                              <div>
                                <h1
                                  className="text-xl md:text-2xl font-semibold hover:underline cursor-pointer"
                                  onClick={() => nav(`/jobdetail/apply/${e.id}`)}
                                >
                                  {e.job_title}
                                </h1>
                                <p className="text-gray-500 text-sm md:text-base">
                                  {e.company.company_name}
                                </p>
                               <p className="text-gray-500 text-sm md:text-base break-all">
  {e.company.company_email}
</p>

                              </div>
                            </div>
                            
            
                            {/* Buttons */}
                            <div className="flex  justify-center gap-4 mt-5">
                              <button
                                className="btn btn-neutral w-1/2 text-center"
                                onClick={() => nav(`/jobdetail/apply/${e.id}`)}
                              >
                                View Details
                              </button>
                            </div>
            
                          </div>
          ))
        )}
     </div>
     </div>
     
     </>
  )
}

export default Appliedjob